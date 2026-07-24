import { randomUUID } from 'node:crypto';
import {
  AuditAction,
  AuditResult,
  EditorialStatus,
  Prisma,
  type AdminUser,
  type ContentEntity,
} from '@/generated/prisma/client';
import { sanitizeAuditValue } from '@/features/admin/audit/sanitize-audit';
import type { ContentInput } from '@/features/admin/domain/content-input';
import { getPrismaClient } from '@/features/admin/persistence/prisma';
import {
  PublicationBlockedError,
  validateCmsPublication,
} from '@/features/content/domain/publication-policy';

export class ContentConflictError extends Error {
  constructor() {
    super(
      'Este registro foi alterado por outra sessão. Recarregue antes de salvar.',
    );
  }
}
function json(value: unknown): Prisma.InputJsonValue {
  return sanitizeAuditValue(value) as Prisma.InputJsonValue;
}
const snapshot = (entity: ContentEntity) => ({
  title: entity.title,
  subtitle: entity.subtitle,
  excerpt: entity.excerpt,
  body: entity.body,
  status: entity.status,
  featured: entity.featured,
  sortOrder: entity.sortOrder,
  version: entity.version,
});
function entityData(input: ContentInput) {
  const { content, ...fields } = input;
  return {
    ...fields,
    body: { content },
    subtitle: fields.subtitle || null,
    excerpt: fields.excerpt || null,
  };
}

export class PrismaCmsRepository {
  private readonly prisma = getPrismaClient();
  list(input: {
    type?: ContentEntity['type'];
    query?: string;
    status?: EditorialStatus;
    page: number;
    pageSize: number;
  }) {
    const where: Prisma.ContentEntityWhereInput = {
      type: input.type,
      status: input.status,
      OR: input.query
        ? [
            { title: { contains: input.query, mode: 'insensitive' } },
            { slug: { contains: input.query, mode: 'insensitive' } },
          ]
        : undefined,
    };
    return Promise.all([
      this.prisma.contentEntity.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prisma.contentEntity.count({ where }),
    ]);
  }
  get(id: string) {
    return this.prisma.contentEntity.findUnique({
      where: { id },
      include: { revisions: { orderBy: { version: 'desc' }, take: 20 } },
    });
  }
  async create(input: ContentInput, actor: AdminUser) {
    return this.prisma.$transaction(async (tx) => {
      const entity = await tx.contentEntity.create({
        data: { ...entityData(input), status: EditorialStatus.DRAFT },
      });
      await tx.revision.create({
        data: {
          entityId: entity.id,
          version: 1,
          snapshot: json(snapshot(entity)),
          changedById: actor.id,
          reason: 'Criação',
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          action: AuditAction.CREATE,
          entityId: entity.id,
          entityType: entity.type,
          after: json(snapshot(entity)),
          origin: 'admin-cms',
          result: AuditResult.SUCCESS,
          requestId: randomUUID(),
        },
      });
      return entity;
    });
  }
  async update(
    id: string,
    expectedVersion: number,
    input: ContentInput,
    actor: AdminUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const before = await tx.contentEntity.findUniqueOrThrow({
        where: { id },
      });
      const nextVersion = before.version + 1;
      const changed = await tx.contentEntity.updateMany({
        where: { id, version: expectedVersion },
        data: { ...entityData(input), version: nextVersion },
      });
      if (!changed.count) {
        await tx.auditLog.create({
          data: {
            actorId: actor.id,
            action: AuditAction.UPDATE,
            entityId: id,
            entityType: before.type,
            origin: 'admin-cms',
            result: AuditResult.CONFLICT,
            message: 'Optimistic concurrency conflict',
            requestId: randomUUID(),
          },
        });
        throw new ContentConflictError();
      }
      const entity = await tx.contentEntity.findUniqueOrThrow({
        where: { id },
      });
      await tx.revision.create({
        data: {
          entityId: id,
          version: nextVersion,
          snapshot: json(snapshot(entity)),
          changedById: actor.id,
          reason: 'Edição',
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          action: AuditAction.UPDATE,
          entityId: id,
          entityType: entity.type,
          before: json(snapshot(before)),
          after: json(snapshot(entity)),
          origin: 'admin-cms',
          result: AuditResult.SUCCESS,
          requestId: randomUUID(),
        },
      });
      return entity;
    });
  }
  async transition(
    id: string,
    expectedVersion: number,
    status: EditorialStatus,
    actor: AdminUser,
    reason?: string,
  ) {
    const actions = {
      REVIEW: AuditAction.SUBMIT_REVIEW,
      PUBLISHED: AuditAction.PUBLISH,
      ARCHIVED: AuditAction.ARCHIVE,
      DRAFT: AuditAction.RESTORE,
    } as const;
    return this.prisma.$transaction(async (tx) => {
      const before = await tx.contentEntity.findUniqueOrThrow({
        where: { id },
      });
      if (status === EditorialStatus.PUBLISHED) {
        const issues = validateCmsPublication(before);
        if (issues.length) throw new PublicationBlockedError(issues);
      }
      const version = before.version + 1;
      const changed = await tx.contentEntity.updateMany({
        where: { id, version: expectedVersion },
        data: {
          status,
          version,
          publishedAt:
            status === EditorialStatus.PUBLISHED
              ? new Date()
              : before.publishedAt,
        },
      });
      if (!changed.count) throw new ContentConflictError();
      const entity = await tx.contentEntity.findUniqueOrThrow({
        where: { id },
      });
      await tx.revision.create({
        data: {
          entityId: id,
          version,
          snapshot: json(snapshot(entity)),
          changedById: actor.id,
          reason,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          action: actions[status],
          entityId: id,
          entityType: entity.type,
          before: json(snapshot(before)),
          after: json(snapshot(entity)),
          origin: 'admin-cms',
          result: AuditResult.SUCCESS,
          requestId: randomUUID(),
        },
      });
      return entity;
    });
  }
  async duplicate(id: string, actor: AdminUser) {
    const source = await this.prisma.contentEntity.findUniqueOrThrow({
      where: { id },
    });
    return this.create(
      {
        type: source.type,
        locale: source.locale,
        slug: `${source.slug}-copy-${Date.now()}`,
        title: `${source.title} — cópia`,
        subtitle: source.subtitle ?? undefined,
        excerpt: source.excerpt ?? undefined,
        content:
          typeof source.body === 'object' &&
          source.body &&
          'content' in source.body
            ? String(source.body.content)
            : '',
        featured: false,
        sortOrder: source.sortOrder,
      },
      actor,
    );
  }
  async restoreRevision(
    revisionId: string,
    expectedVersion: number,
    actor: AdminUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const revision = await tx.revision.findUniqueOrThrow({
        where: { id: revisionId },
      });
      const current = await tx.contentEntity.findUniqueOrThrow({
        where: { id: revision.entityId },
      });
      const value = revision.snapshot as Record<string, unknown>;
      const version = current.version + 1;
      const changed = await tx.contentEntity.updateMany({
        where: { id: current.id, version: expectedVersion },
        data: {
          title: String(value.title),
          subtitle: value.subtitle ? String(value.subtitle) : null,
          excerpt: value.excerpt ? String(value.excerpt) : null,
          body: value.body as Prisma.InputJsonValue,
          featured: Boolean(value.featured),
          sortOrder: Number(value.sortOrder),
          status: EditorialStatus.DRAFT,
          version,
        },
      });
      if (!changed.count) throw new ContentConflictError();
      const entity = await tx.contentEntity.findUniqueOrThrow({
        where: { id: current.id },
      });
      await tx.revision.create({
        data: {
          entityId: entity.id,
          version,
          snapshot: json(snapshot(entity)),
          changedById: actor.id,
          reason: `Restaurado da versão ${revision.version}`,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          action: AuditAction.RESTORE,
          entityId: entity.id,
          entityType: entity.type,
          before: json(snapshot(current)),
          after: json(snapshot(entity)),
          origin: 'admin-cms',
          result: AuditResult.SUCCESS,
          requestId: randomUUID(),
        },
      });
      return entity;
    });
  }
}

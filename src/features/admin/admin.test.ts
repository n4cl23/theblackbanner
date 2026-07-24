import { config } from 'dotenv';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  AdminRole,
  ContentLocale,
  ContentType,
  EditorialStatus,
} from '@/generated/prisma/client';
import { sanitizeAuditValue } from '@/features/admin/audit/sanitize-audit';
import { can } from '@/features/admin/auth/authorization';
import { contentInputSchema } from '@/features/admin/domain/content-input';
import { UnconfiguredMediaStorage } from '@/features/admin/media/media-storage';
import {
  ContentConflictError,
  PrismaCmsRepository,
} from '@/features/admin/persistence/cms-repository';
import { getPrismaClient } from '@/features/admin/persistence/prisma';

config({ path: '.env.local', quiet: true });
const runIntegration =
  Boolean(process.env.DATABASE_URL) && process.env.CI !== 'true';
describe('admin security and CMS', () => {
  it('enforces the initial role matrix', () => {
    expect(can(AdminRole.ADMIN, 'publish')).toBe(true);
    expect(can(AdminRole.EDITOR, 'submit')).toBe(true);
    expect(can(AdminRole.EDITOR, 'publish')).toBe(false);
    expect(can(AdminRole.REVIEWER, 'publish')).toBe(true);
    expect(can(AdminRole.REVIEWER, 'edit')).toBe(false);
  });
  it('validates editorial input and rejects malformed slugs', () => {
    const valid = {
      type: ContentType.CHARACTER,
      locale: ContentLocale.PT_BR,
      slug: 'valid-slug',
      title: 'Valid title',
      content: 'Body',
      featured: false,
      sortOrder: 0,
    };
    expect(contentInputSchema.safeParse(valid).success).toBe(true);
    expect(
      contentInputSchema.safeParse({ ...valid, slug: '../secret' }).success,
    ).toBe(false);
  });
  it('redacts secrets recursively from audit values', () => {
    expect(
      sanitizeAuditValue({
        title: 'Safe',
        nested: { authorization: 'Bearer private', token: 'private' },
      }),
    ).toEqual({
      title: 'Safe',
      nested: { authorization: '[REDACTED]', token: '[REDACTED]' },
    });
  });
  it('never stores media bytes in PostgreSQL through the abstraction', async () => {
    await expect(
      new UnconfiguredMediaStorage().reserve({
        filename: 'large.glb',
        mimeType: 'model/gltf-binary',
        byteSize: BigInt(1),
      }),
    ).rejects.toThrow(/never stored in PostgreSQL/i);
  });
});

describe.skipIf(!runIntegration)('Prisma CMS integration', () => {
  let prisma: ReturnType<typeof getPrismaClient>;
  let repository: PrismaCmsRepository;
  let actorId = '';
  let entityId = '';
  beforeAll(async () => {
    prisma = getPrismaClient();
    repository = new PrismaCmsRepository();
    const actor = await prisma.adminUser.upsert({
      where: { externalAuthId: 'integration-test-admin' },
      update: {},
      create: {
        externalAuthId: 'integration-test-admin',
        email: 'integration-test@example.invalid',
        displayName: 'Integration Test',
        role: AdminRole.ADMIN,
      },
    });
    actorId = actor.id;
  });
  afterAll(async () => {
    if (entityId)
      await prisma.contentEntity.deleteMany({ where: { id: entityId } });
    await prisma.auditLog.deleteMany({ where: { actorId } });
    await prisma.adminUser.deleteMany({ where: { id: actorId } });
    await prisma.$disconnect();
  });
  it('performs CRUD workflow, revisions, audit, publication, and concurrency checks', async () => {
    const actor = await prisma.adminUser.findUniqueOrThrow({
      where: { id: actorId },
    });
    const input = {
      type: ContentType.LORE_ARTICLE,
      locale: ContentLocale.EN,
      slug: `integration-${Date.now()}`,
      title: 'Integration record',
      content: 'Draft body',
      featured: false,
      sortOrder: 0,
    };
    const created = await repository.create(input, actor);
    entityId = created.id;
    expect(created.status).toBe(EditorialStatus.DRAFT);
    const updated = await repository.update(
      created.id,
      created.version,
      { ...input, title: 'Updated record' },
      actor,
    );
    expect(updated.version).toBe(2);
    await expect(
      repository.update(created.id, created.version, input, actor),
    ).rejects.toBeInstanceOf(ContentConflictError);
    const review = await repository.transition(
      created.id,
      updated.version,
      EditorialStatus.REVIEW,
      actor,
    );
    const published = await repository.transition(
      created.id,
      review.version,
      EditorialStatus.PUBLISHED,
      actor,
    );
    expect(published.publishedAt).toBeInstanceOf(Date);
    const stored = await repository.get(created.id);
    expect(stored?.revisions.length).toBeGreaterThanOrEqual(4);
    expect(
      await prisma.auditLog.count({
        where: { entityId: created.id, result: 'SUCCESS' },
      }),
    ).toBeGreaterThanOrEqual(4);
  });
});

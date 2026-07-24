'use server';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import {
  AuditAction,
  AuditResult,
  EditorialStatus,
} from '@/generated/prisma/client';
import {
  requireAdminUser,
  type AdminCapability,
} from '@/features/admin/auth/authorization';
import { enforceAdminRateLimit } from '@/features/admin/auth/rate-limit';
import { contentInputSchema } from '@/features/admin/domain/content-input';
import { PrismaCmsRepository } from '@/features/admin/persistence/cms-repository';
import { getPrismaClient } from '@/features/admin/persistence/prisma';
export interface FormState {
  ok: boolean;
  message: string;
}
function parseForm(formData: FormData) {
  return contentInputSchema.safeParse({
    type: formData.get('type'),
    locale: formData.get('locale'),
    slug: formData.get('slug'),
    title: formData.get('title'),
    subtitle: formData.get('subtitle') || undefined,
    excerpt: formData.get('excerpt') || undefined,
    content: formData.get('content'),
    featured: formData.get('featured') === 'on',
    sortOrder: Number(formData.get('sortOrder') ?? 0),
  });
}
async function auditValidation(actorId: string, message: string) {
  await getPrismaClient().auditLog.create({
    data: {
      actorId,
      action: AuditAction.UPDATE,
      origin: 'admin-cms',
      result: AuditResult.VALIDATION_ERROR,
      message,
      requestId: randomUUID(),
    },
  });
}
export async function saveContent(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get('id') ?? '');
  const capability: AdminCapability = id ? 'edit' : 'create';
  const actor = await requireAdminUser(capability);
  await enforceAdminRateLimit(actor.id);
  const parsed = parseForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos.';
    await auditValidation(actor.id, message);
    return { ok: false, message };
  }
  try {
    const repository = new PrismaCmsRepository();
    if (id)
      await repository.update(
        id,
        Number(formData.get('version')),
        parsed.data,
        actor,
      );
    else await repository.create(parsed.data, actor);
    revalidatePath('/admin');
    return { ok: true, message: 'Registro salvo com segurança.' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Falha ao salvar.',
    };
  }
}
const capabilityForStatus: Record<EditorialStatus, AdminCapability> = {
  DRAFT: 'restore',
  REVIEW: 'submit',
  PUBLISHED: 'publish',
  ARCHIVED: 'archive',
};
export async function transitionContent(formData: FormData) {
  const status =
    EditorialStatus[
      String(formData.get('status')) as keyof typeof EditorialStatus
    ];
  if (!status) throw new Error('Status inválido.');
  const actor = await requireAdminUser(capabilityForStatus[status]);
  await enforceAdminRateLimit(actor.id);
  await new PrismaCmsRepository().transition(
    String(formData.get('id')),
    Number(formData.get('version')),
    status,
    actor,
    String(formData.get('reason') ?? ''),
  );
  revalidatePath('/admin');
}
export async function duplicateContent(formData: FormData) {
  const actor = await requireAdminUser('duplicate');
  await enforceAdminRateLimit(actor.id);
  await new PrismaCmsRepository().duplicate(String(formData.get('id')), actor);
  revalidatePath('/admin');
}
export async function restoreRevision(formData: FormData) {
  const actor = await requireAdminUser('restore');
  await enforceAdminRateLimit(actor.id);
  await new PrismaCmsRepository().restoreRevision(
    String(formData.get('revisionId')),
    Number(formData.get('version')),
    actor,
  );
  revalidatePath('/admin');
}
export async function logoutAudit() {
  const actor = await requireAdminUser('read');
  await getPrismaClient().auditLog.create({
    data: {
      actorId: actor.id,
      action: AuditAction.LOGOUT,
      origin: 'admin-cms',
      result: AuditResult.SUCCESS,
      requestId: randomUUID(),
    },
  });
}

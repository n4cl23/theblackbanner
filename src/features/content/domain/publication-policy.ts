import { z } from 'zod';
import type { ContentEntity } from '@/generated/prisma/client';
import type { ContentDataset } from '@/features/content/domain/content-types';

export type PublicationIssue = Readonly<{
  path: string;
  message: string;
}>;

type CmsPublicationRecord = Pick<
  ContentEntity,
  'title' | 'slug' | 'excerpt' | 'body'
>;

const bodySchema = z.object({ content: z.string().trim().min(1) });

export function validateCmsPublication(
  record: CmsPublicationRecord,
): readonly PublicationIssue[] {
  const issues: PublicationIssue[] = [];
  if (!record.title.trim())
    issues.push({ path: 'title', message: 'Título obrigatório.' });
  if (!record.slug.trim())
    issues.push({ path: 'slug', message: 'Slug obrigatório.' });
  if (!record.excerpt?.trim())
    issues.push({ path: 'excerpt', message: 'Resumo obrigatório.' });
  if (!bodySchema.safeParse(record.body).success)
    issues.push({ path: 'body', message: 'Conteúdo editorial obrigatório.' });
  return issues;
}

export function validateDatasetPublication(
  dataset: ContentDataset,
): readonly PublicationIssue[] {
  const issues: PublicationIssue[] = [];
  const entities = Object.values(dataset).flat();

  for (const entity of entities) {
    if (entity.status !== 'published') continue;
    if (!entity.description.trim())
      issues.push({
        path: `${entity.id}.description`,
        message: 'Descrição obrigatória para publicação.',
      });
    if (!entity.seo.title.trim() || !entity.seo.description.trim())
      issues.push({
        path: `${entity.id}.seo`,
        message: 'SEO obrigatório para publicação.',
      });
    if (
      !entity.cover &&
      !['tag', 'category', 'relationship'].includes(entity.kind)
    )
      issues.push({
        path: `${entity.id}.cover`,
        message: 'Mídia de capa obrigatória para publicação.',
      });
  }
  return issues;
}

export class PublicationBlockedError extends Error {
  constructor(readonly issues: readonly PublicationIssue[]) {
    super(
      'Publicação bloqueada: o registro não atende aos requisitos mínimos.',
    );
    this.name = 'PublicationBlockedError';
  }
}

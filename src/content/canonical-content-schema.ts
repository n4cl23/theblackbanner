import { z } from 'zod';

export const canonicalEntityTypeSchema = z.enum([
  'page',
  'collection',
  'atlas-entry',
  'character',
  'guardian',
  'crown',
  'kingdom',
  'creature',
]);

const canonicalMediaSchema = z.object({
  url: z.url(),
  source: z.literal('V1'),
  verified: z.literal(true),
});

export const canonicalContentRecordSchema = z.object({
  id: z.string().regex(/^canonical-[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  epithet: z.string().trim().min(1).nullable(),
  description: z.string().trim().min(1),
  body: z.array(z.string().trim().min(1)).min(1),
  entityType: canonicalEntityTypeSchema,
  locale: z.literal('pt-BR'),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
  categories: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
  scales: z.array(z.string().min(1)),
  kingdomSlugs: z.array(z.string().min(1)),
  collectionSlugs: z.array(z.string().min(1)),
  relationshipIds: z.array(z.string().min(1)),
  media: z.array(canonicalMediaSchema),
  source: z.object({
    system: z.literal('The Black Banner V1'),
    url: z.url(),
    previousSlug: z.string().min(1),
    previousEntity: z.string().min(1),
  }),
  migration: z.object({
    migratedAt: z.iso.datetime(),
    decision: z.enum(['MIGRAR', 'MIGRAR_COM_CORREÇÃO', 'REVISÃO_HUMANA']),
    notes: z.string().min(1),
  }),
});

export const canonicalContentCollectionSchema = z
  .array(canonicalContentRecordSchema)
  .superRefine((records, context) => {
    const ids = new Set(records.map((record) => record.id));
    const slugs = new Set<string>();
    records.forEach((record, index) => {
      if (slugs.has(record.slug))
        context.addIssue({
          code: 'custom',
          path: [index, 'slug'],
          message: `Duplicate canonical slug: ${record.slug}`,
        });
      slugs.add(record.slug);
      record.relationshipIds.forEach((id) => {
        if (!ids.has(id))
          context.addIssue({
            code: 'custom',
            path: [index, 'relationshipIds'],
            message: `Missing canonical relationship: ${id}`,
          });
      });
    });
  });

export type CanonicalContentRecord = z.infer<
  typeof canonicalContentRecordSchema
>;

import { z } from 'zod';

export const collectionCategorySchema = z.enum([
  'characters',
  'creatures',
  'bosses',
  'taverns',
  'mercenaries',
  'guardians',
  'factions',
  'thematic',
]);

const mediaSchema = z.object({
  src: z.string().startsWith('/'),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const miniatureSchema = z.object({
  id: z.string().regex(/^miniature-[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  locale: z.literal('pt-br'),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  collectionSlug: z.string().min(1),
  collectionTitle: z.string().min(1),
  entityType: z.enum(['character', 'creature']),
  entitySlug: z.string().min(1),
  description: z.string().min(1).nullable(),
  scale: z.string().min(1).nullable(),
  dimensionsMm: z
    .object({
      height: z.number().positive().nullable(),
      width: z.number().positive().nullable(),
      depth: z.number().positive().nullable(),
    })
    .nullable(),
  pieceCount: z.number().int().positive().nullable(),
  base: z.string().min(1).nullable(),
  support: z.string().min(1).nullable(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).nullable(),
  material: z.string().min(1).nullable(),
  cover: mediaSchema.nullable(),
  gallery: z.array(mediaSchema),
  video: z
    .object({ src: z.string().startsWith('/'), poster: z.string().nullable() })
    .nullable(),
  model3d: z.null(),
  privateStlAvailable: z.boolean(),
  privateGlbAvailable: z.boolean(),
  hasSourcePdf: z.boolean(),
  confidence: z.enum(['ALTA', 'MÉDIA', 'BAIXA', 'NÃO IDENTIFICADO']),
  sourceFingerprint: z.string().regex(/^[a-f0-9]{64}$/),
  editorialPending: z.array(z.string().min(1)),
});

export const miniatureCollectionSchema = z
  .array(miniatureSchema)
  .superRefine((records, context) => {
    const slugs = new Set<string>();
    records.forEach((record, index) => {
      if (slugs.has(record.slug)) {
        context.addIssue({
          code: 'custom',
          path: [index, 'slug'],
          message: `Duplicate miniature slug: ${record.slug}`,
        });
      }
      slugs.add(record.slug);
    });
  });

export const realCollectionSchema = z.object({
  id: z.string().regex(/^collection-[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  locale: z.literal('pt-br'),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  description: z.string().min(1).nullable(),
  history: z.array(z.string().min(1)),
  cover: mediaSchema.nullable(),
  itemSlugs: z.array(z.string().min(1)),
  editorialPending: z.array(z.string().min(1)),
});

export type CollectionCategory = z.infer<typeof collectionCategorySchema>;
export type Miniature = z.infer<typeof miniatureSchema>;
export type RealCollection = z.infer<typeof realCollectionSchema>;

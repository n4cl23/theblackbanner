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
const technicalMiniatureSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  relatedEntity: z.object({
    type: z.enum(['character', 'creature', 'guardian']),
    id: z.string().min(1),
  }),
  collectionIds: z.array(z.string().min(1)).min(1),
  scale: z.string().min(1),
  dimensionsMm: z.object({
    height: z.number().positive(),
    width: z.number().positive(),
    depth: z.number().positive(),
  }),
  pieceCount: z.number().int().positive(),
  support: z.enum(['unsupported', 'presupported', 'both']),
  base: z.string().min(1),
  suggestedMaterial: z.string().min(1),
  resolutionMicrons: z.number().int().positive(),
  orientation: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  targetPrinter: z.string().min(1),
  includedFileDescriptors: z.array(z.string().min(1)).min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  changelog: z
    .array(
      z.object({ version: z.string(), note: z.string(), date: z.iso.date() }),
    )
    .min(1),
  provenance: z.literal('mock'),
  privateFileUrl: z.never().optional(),
});
const mediaSchema = z.object({
  src: z.string().startsWith('/'),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export const miniatureSchema = technicalMiniatureSchema.extend({
  subtitle: z.string().min(1),
  excerpt: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  locale: z.enum(['pt-br', 'en', 'es']),
  featured: z.boolean(),
  collectionSlug: z.string().min(1),
  entityType: z.enum(['character', 'creature', 'guardian']),
  entitySlug: z.string().min(1),
  kingdomSlug: z.string().min(1),
  baseIncluded: z.boolean(),
  presupported: z.boolean(),
  supportDifficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  printDifficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  recommendedMaterial: z.string().min(1),
  cover: mediaSchema,
  banner: mediaSchema,
  gallery: z.array(mediaSchema),
  video: z.null(),
  model3d: z.null(),
  printGuide: z.string().startsWith('/'),
  availability: z.enum(['documented', 'preview']),
  seo: z.object({ title: z.string(), description: z.string() }),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type CollectionCategory = z.infer<typeof collectionCategorySchema>;
export type Miniature = z.infer<typeof miniatureSchema>;
export type TechnicalMiniature = z.infer<typeof technicalMiniatureSchema>;

import { z } from 'zod';

export const editorialStatusSchema = z.enum([
  'draft',
  'review',
  'published',
  'archived',
]);

export const localeSchema = z.enum(['pt-BR', 'en']);

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const entityTypeSchema = z.enum([
  'character',
  'creature',
  'kingdom',
  'region',
  'collection',
  'weapon',
  'crown',
  'guardian',
  'timelineEvent',
  'loreArticle',
  'galleryItem',
  'mediaAsset',
  'printProfile',
  'faction',
  'location',
  'relationship',
  'tag',
  'category',
]);

export const entityReferenceSchema = z.object({
  type: entityTypeSchema,
  id: z.string().min(1),
});

export const mediaAssetReferenceSchema = z.object({
  id: z.string().min(1),
  alt: z.string().min(1),
});

export const seoSchema = z.object({
  title: z.string().min(1).max(70),
  description: z.string().min(1).max(170),
  canonicalPath: z.string().startsWith('/'),
  noIndex: z.boolean().default(false),
});

export const editorialCoreSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  subtitle: z.string().default(''),
  excerpt: z.string().min(1),
  description: z.string().min(1),
  status: editorialStatusSchema,
  locale: localeSchema,
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
  tags: z.array(z.string().min(1)),
  seo: seoSchema,
  cover: mediaAssetReferenceSchema.nullable(),
  gallery: z.array(mediaAssetReferenceSchema),
  provenance: z.literal('mock'),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const relationshipSchema = editorialCoreSchema.extend({
  kind: z.enum([
    'ally',
    'enemy',
    'kin',
    'rival',
    'serves',
    'hunts',
    'protects',
    'contested',
    'treaty',
  ]),
  source: entityReferenceSchema,
  target: entityReferenceSchema,
  reciprocal: z.boolean(),
});

export const characterSchema = editorialCoreSchema.extend({
  kind: z.literal('character'),
  kingdomId: z.string().min(1),
  factionIds: z.array(z.string().min(1)),
  eventIds: z.array(z.string().min(1)),
  weaponIds: z.array(z.string().min(1)),
  relationshipIds: z.array(z.string().min(1)),
  role: z.string().min(1),
});

export const creatureSchema = editorialCoreSchema.extend({
  kind: z.literal('creature'),
  regionIds: z.array(z.string().min(1)).min(1),
  kingdomBestiaryIds: z.array(z.string().min(1)),
  characterRelationshipIds: z.array(z.string().min(1)),
  classification: z.string().min(1),
  threatLevel: z.enum(['unknown', 'low', 'severe', 'extreme']),
});

export const kingdomSchema = editorialCoreSchema.extend({
  kind: z.literal('kingdom'),
  regionIds: z.array(z.string().min(1)).min(1),
  factionIds: z.array(z.string().min(1)),
  rulerCharacterId: z.string().min(1).nullable(),
  relationshipIds: z.array(z.string().min(1)),
  sigil: z.string().min(1),
});

export const regionSchema = editorialCoreSchema.extend({
  kind: z.literal('region'),
  kingdomId: z.string().min(1),
  locationIds: z.array(z.string().min(1)),
  climate: z.string().min(1),
});

export const collectionSchema = editorialCoreSchema.extend({
  kind: z.literal('collection'),
  itemRefs: z
    .array(
      entityReferenceSchema.refine(
        (reference) =>
          reference.type === 'character' || reference.type === 'creature',
        'Collections may contain only characters or creatures.',
      ),
    )
    .min(1),
  printProfileId: z.string().min(1).nullable(),
});

export const weaponSchema = editorialCoreSchema.extend({
  kind: z.literal('weapon'),
  ownerCharacterIds: z.array(z.string().min(1)),
  weaponType: z.string().min(1),
});

export const crownSchema = editorialCoreSchema.extend({
  kind: z.literal('crown'),
  kingdomId: z.string().min(1),
  bearerCharacterId: z.string().min(1).nullable(),
});

export const guardianSchema = editorialCoreSchema
  .extend({
    kind: z.literal('guardian'),
    characterId: z.string().min(1).nullable(),
    creatureId: z.string().min(1).nullable(),
    locationId: z.string().min(1),
  })
  .refine(
    (guardian) =>
      Boolean(guardian.characterId) !== Boolean(guardian.creatureId),
    'A guardian must reference exactly one character or creature.',
  );

export const timelineEventSchema = editorialCoreSchema.extend({
  kind: z.literal('timelineEvent'),
  dateLabel: z.string().min(1),
  chronologyOrder: z.number().int(),
  entityRefs: z.array(entityReferenceSchema).min(2),
});

export const loreArticleSchema = editorialCoreSchema.extend({
  kind: z.literal('loreArticle'),
  body: z.array(z.string().min(1)).min(1),
  citedEntityRefs: z.array(entityReferenceSchema).min(1),
  categoryIds: z.array(z.string().min(1)),
});

export const galleryItemSchema = editorialCoreSchema.extend({
  kind: z.literal('galleryItem'),
  mediaAssetId: z.string().min(1),
  relatedEntityRefs: z.array(entityReferenceSchema),
});

export const mediaAssetSchema = editorialCoreSchema.extend({
  kind: z.literal('mediaAsset'),
  mediaType: z.enum(['image', 'video', 'audio', 'model']),
  path: z.string().startsWith('/'),
  mimeType: z.string().min(1),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  durationSeconds: z.number().nonnegative().nullable(),
});

export const printProfileSchema = editorialCoreSchema.extend({
  kind: z.literal('printProfile'),
  scale: z.string().min(1),
  supportStrategy: z.enum(['none', 'light', 'medium', 'heavy']),
  fileFormat: z.enum(['stl', 'obj', '3mf']),
});

export const factionSchema = editorialCoreSchema.extend({
  kind: z.literal('faction'),
  kingdomId: z.string().min(1).nullable(),
  memberCharacterIds: z.array(z.string().min(1)),
});

export const locationSchema = editorialCoreSchema.extend({
  kind: z.literal('location'),
  regionId: z.string().min(1),
  coordinates: z.object({ x: z.number(), y: z.number() }).nullable(),
});

export const tagSchema = editorialCoreSchema.extend({
  kind: z.literal('tag'),
  label: z.string().min(1),
});

export const categorySchema = editorialCoreSchema.extend({
  kind: z.literal('category'),
  label: z.string().min(1),
  parentCategoryId: z.string().min(1).nullable(),
});

export const contentDatasetSchema = z.object({
  characters: z.array(characterSchema),
  creatures: z.array(creatureSchema),
  kingdoms: z.array(kingdomSchema),
  regions: z.array(regionSchema),
  collections: z.array(collectionSchema),
  weapons: z.array(weaponSchema),
  crowns: z.array(crownSchema),
  guardians: z.array(guardianSchema),
  timelineEvents: z.array(timelineEventSchema),
  loreArticles: z.array(loreArticleSchema),
  galleryItems: z.array(galleryItemSchema),
  mediaAssets: z.array(mediaAssetSchema),
  printProfiles: z.array(printProfileSchema),
  factions: z.array(factionSchema),
  locations: z.array(locationSchema),
  relationships: z.array(relationshipSchema),
  tags: z.array(tagSchema),
  categories: z.array(categorySchema),
});

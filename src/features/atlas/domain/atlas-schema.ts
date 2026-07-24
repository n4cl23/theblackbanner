import { z } from 'zod';

export const atlasLayerSchema = z.enum([
  'borders',
  'kingdoms',
  'regions',
  'cities',
  'ruins',
  'danger-zones',
  'creatures',
  'historical-events',
]);
export const biomeSchema = z.object({
  id: z.string(),
  title: z.string(),
  climate: z.string(),
});
export const pointOfInterestSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  regionSlug: z.string(),
  coordinates: z.object({ x: z.number(), y: z.number() }).nullable(),
});
export const atlasRegionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  kingdomSlug: z.string(),
  description: z.string(),
  climate: z.string(),
  biome: biomeSchema,
  dangerLevel: z.enum(['unknown', 'low', 'severe', 'extreme']),
  dominantSpecies: z.array(z.string()),
  creatures: z.array(z.string()),
  locations: z.array(z.string()),
  landmarks: z.array(z.string()),
  historicalEvents: z.array(z.string()),
  mapCoordinates: z.object({ x: z.number(), y: z.number() }).nullable(),
  media: z.string(),
  status: z.literal('published'),
  locale: z.literal('pt-br'),
});
export const atlasSchema = z.object({
  id: z.literal('asterheim'),
  locale: z.literal('pt-br'),
  kingdomSlugs: z.array(z.string()),
  regionSlugs: z.array(z.string()),
  layers: z.array(atlasLayerSchema),
});
export type AtlasRegion = z.infer<typeof atlasRegionSchema>;
export type AtlasLayer = z.infer<typeof atlasLayerSchema>;

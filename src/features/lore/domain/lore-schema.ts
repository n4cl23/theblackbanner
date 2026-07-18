import { z } from 'zod';

export const narrativeRelationKindSchema = z.enum([
  'ally',
  'enemy',
  'mentor',
  'apprentice',
  'family',
  'rival',
  'creator',
  'bound-creature',
  'oath',
  'debt',
  'conflict',
  'shared-event',
]);

export const narrativeRelationSchema = z.object({
  id: z.string().min(1),
  kind: narrativeRelationKindSchema,
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
  sourceHref: z.string().startsWith('/'),
  targetHref: z.string().startsWith('/'),
  provenance: z.literal('mock'),
});

export const timelinePresentationSchema = z.object({
  eventId: z.string().min(1),
  era: z.string().min(1),
  year: z.number().int(),
  impact: z.enum(['local', 'regional', 'continental']),
  conflict: z.string().min(1),
  kingdomIds: z.array(z.string()),
  characterIds: z.array(z.string()),
  creatureIds: z.array(z.string()),
  factionIds: z.array(z.string()),
  relatedEventIds: z.array(z.string()),
  provenance: z.literal('mock'),
});

const chapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.array(z.string().min(1)).min(2),
});

export const chronicleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  excerpt: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  chapters: z.array(chapterSchema).min(2),
  entityIds: z.array(z.string()).min(1),
  relatedArticleSlugs: z.array(z.string()),
  provenance: z.literal('mock'),
});

export type NarrativeRelation = z.infer<typeof narrativeRelationSchema>;
export type TimelinePresentation = z.infer<typeof timelinePresentationSchema>;
export type Chronicle = z.infer<typeof chronicleSchema>;

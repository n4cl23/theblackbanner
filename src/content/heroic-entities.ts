import { z } from 'zod';
import { canonicalContent } from '@/content/canonical-content';

const heroicStatusSchema = z.enum(['draft', 'review']);
const heroicLocaleSchema = z.literal('pt-BR');

const baseSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  description: z.string().min(1),
  locale: heroicLocaleSchema,
  status: heroicStatusSchema,
  kingdom: z.object({ slug: z.string().min(1), title: z.string().min(1) }),
  documentedAt: z.string().min(1),
  sourceUrl: z.url(),
  media: z.array(z.object({ url: z.url(), alt: z.string().min(1) })),
});

export const guardianSchema = baseSchema.extend({
  kind: z.literal('guardian'),
  crownSlug: z.string().min(1),
  domain: z.string().nullable(),
  oath: z.string().nullable(),
  sacrifice: z.string().nullable(),
  relic: z.string().nullable(),
});

export const crownSchema = baseSchema.extend({
  kind: z.literal('crown'),
  guardianSlug: z.string().min(1),
  force: z.string().min(1),
  symbol: z.string().nullable(),
  history: z.string().min(1),
  relics: z.array(z.string().min(1)),
  currentState: z.string().nullable(),
});

export type GuardianRecord = z.infer<typeof guardianSchema>;
export type CrownRecord = z.infer<typeof crownSchema>;
export type CharacterRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  locale: 'pt-BR';
  status: 'draft' | 'review';
  collection: string | null;
  kingdom: string;
  faction: string | null;
  role: string | null;
  type: string;
  scale: string | null;
};

const pairs = [
  {
    guardian: 'king-aldric',
    guardianSource: 'guardian-king-aldric',
    crown: 'iron-crown',
    crownSource: 'crown-iron-crown',
    kingdom: { slug: 'ironhold', title: 'Ironhold' },
    force: 'Ferro',
  },
  {
    guardian: 'vhaldris',
    guardianSource: 'guardian-vhaldris',
    crown: 'frost-crown',
    crownSource: 'crown-frost-crown',
    kingdom: { slug: 'frost-kingdom', title: 'Frost Kingdom' },
    force: 'Gelo',
  },
  {
    guardian: 'yggor',
    guardianSource: 'guardian-yggor',
    crown: 'oak-crown',
    crownSource: 'crown-oak-crown',
    kingdom: { slug: 'elder-forest', title: 'Elder Forest' },
    force: 'Carvalho',
  },
  {
    guardian: 'vaelor',
    guardianSource: 'guardian-vaelor',
    crown: 'storm-crown',
    crownSource: 'crown-storm-crown',
    kingdom: { slug: 'stormreach', title: 'Stormreach' },
    force: 'Tempestade',
  },
  {
    guardian: 'nereus',
    guardianSource: 'guardian-nereus',
    crown: 'abyss-crown',
    crownSource: 'crown-abyss-crown',
    kingdom: { slug: 'kingdom-of-the-abyss', title: 'Kingdom of the Abyss' },
    force: 'Abismo',
  },
  {
    guardian: 'last-dragon-slayer',
    guardianSource: 'guardian-last-dragon-slayer',
    crown: 'dragon-crown',
    crownSource: 'crown-dragon-crown',
    kingdom: { slug: 'scorched-wastes', title: 'Scorched Wastes' },
    force: 'Dragão',
  },
] as const;

const sourceBySlug = new Map(
  canonicalContent.map((record) => [record.slug, record]),
);

function requiredSource(slug: string) {
  const source = sourceBySlug.get(slug);
  if (!source) throw new Error(`Missing approved canonical source: ${slug}`);
  return source;
}

export const guardians = pairs.map((pair) => {
  const source = requiredSource(pair.guardianSource);
  return guardianSchema.parse({
    id: `guardian-${pair.guardian}`,
    slug: pair.guardian,
    title: source.title,
    description: source.description,
    locale: source.locale,
    status: source.status,
    kingdom: pair.kingdom,
    documentedAt: 'Era Atual · Ano 742',
    sourceUrl: source.source.url,
    media: source.media.map((asset) => ({
      url: asset.url,
      alt: `Registro de ${source.title}`,
    })),
    kind: 'guardian',
    crownSlug: pair.crown,
    domain: null,
    oath: null,
    sacrifice: null,
    relic: null,
  });
});

export const crowns = pairs.map((pair) => {
  const source = requiredSource(pair.crownSource);
  return crownSchema.parse({
    id: `crown-${pair.crown}`,
    slug: pair.crown,
    title: source.title,
    description: source.description,
    locale: source.locale,
    status: source.status,
    kingdom: pair.kingdom,
    documentedAt: 'Era Atual · Ano 742',
    sourceUrl: source.source.url,
    media: source.media.map((asset) => ({
      url: asset.url,
      alt: `Registro de ${source.title}`,
    })),
    kind: 'crown',
    guardianSlug: pair.guardian,
    force: pair.force,
    symbol: null,
    history: source.description,
    relics: [],
    currentState: null,
  });
});

export const approvedCharacters: readonly CharacterRecord[] = [];

export function getGuardian(slug: string) {
  return guardians.find((record) => record.slug === slug) ?? null;
}

export function getCrown(slug: string) {
  return crowns.find((record) => record.slug === slug) ?? null;
}

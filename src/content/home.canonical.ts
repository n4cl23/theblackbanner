import { getCanonicalContentByType } from '@/content/canonical-content';
import type {
  FeaturedCharacter,
  FeaturedCollection,
  FeaturedCreature,
  FeaturedKingdom,
  FeaturedStory,
} from '@/types/home';

const canonicalCollections = getCanonicalContentByType('collection');

// Grupos pendentes de revisão permanecem vazios para evitar fallback silencioso.
export const featuredKingdoms: readonly FeaturedKingdom[] = [];
export const featuredCharacters: readonly FeaturedCharacter[] = [];
export const featuredCreatures: readonly FeaturedCreature[] = [];
export const featuredStories: readonly FeaturedStory[] = [];

export const featuredCollections: readonly FeaturedCollection[] =
  canonicalCollections.slice(0, 3).map((record) => ({
    id: record.id,
    name: record.title,
    format: 'Coleção editorial canônica',
    itemCount: record.relationshipIds.length,
    summary: record.description,
    isMock: false,
  }));

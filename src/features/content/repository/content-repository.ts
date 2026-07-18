import type {
  Character,
  Collection,
  Creature,
  Kingdom,
  TimelineEvent,
} from '@/features/content/domain/content-types';

export interface ContentRepository {
  getCharacters(): Promise<readonly Character[]>;
  getCharacterBySlug(slug: string): Promise<Character | null>;
  getKingdoms(): Promise<readonly Kingdom[]>;
  getKingdomBySlug(slug: string): Promise<Kingdom | null>;
  getCreatures(): Promise<readonly Creature[]>;
  getCreatureBySlug(slug: string): Promise<Creature | null>;
  getCollections(): Promise<readonly Collection[]>;
  getTimelineEvents(): Promise<readonly TimelineEvent[]>;
}

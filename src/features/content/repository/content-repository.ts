import type {
  Character,
  Collection,
  Creature,
  Kingdom,
  Faction,
  GalleryItem,
  Guardian,
  Location,
  Region,
  Relationship,
  Weapon,
  PrintProfile,
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
  getRegions(): Promise<readonly Region[]>;
  getFactions(): Promise<readonly Faction[]>;
  getLocations(): Promise<readonly Location[]>;
  getGalleryItems(): Promise<readonly GalleryItem[]>;
  getGuardians(): Promise<readonly Guardian[]>;
  getWeapons(): Promise<readonly Weapon[]>;
  getRelationships(): Promise<readonly Relationship[]>;
  getPrintProfiles(): Promise<readonly PrintProfile[]>;
}

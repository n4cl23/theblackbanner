import type {
  Character,
  Collection,
  ContentDataset,
  Creature,
  Faction,
  GalleryItem,
  Guardian,
  Kingdom,
  Location,
  Region,
  Relationship,
  Weapon,
  PrintProfile,
  TimelineEvent,
} from '@/features/content/domain/content-types';
import type { ContentRepository } from '@/features/content/repository/content-repository';
import type { ContentSourceAdapter } from '@/features/content/repository/content-source-adapter';

function byOrder<T extends { order: number }>(
  items: readonly T[],
): readonly T[] {
  return [...items].sort((left, right) => left.order - right.order);
}

export class InMemoryContentRepository implements ContentRepository {
  constructor(private readonly dataset: ContentDataset) {}

  getCharacters(): Promise<readonly Character[]> {
    return Promise.resolve(byOrder(this.dataset.characters));
  }

  getCharacterBySlug(slug: string): Promise<Character | null> {
    return Promise.resolve(
      this.dataset.characters.find((character) => character.slug === slug) ??
        null,
    );
  }

  getKingdoms(): Promise<readonly Kingdom[]> {
    return Promise.resolve(byOrder(this.dataset.kingdoms));
  }

  getKingdomBySlug(slug: string): Promise<Kingdom | null> {
    return Promise.resolve(
      this.dataset.kingdoms.find((kingdom) => kingdom.slug === slug) ?? null,
    );
  }

  getCreatures(): Promise<readonly Creature[]> {
    return Promise.resolve(byOrder(this.dataset.creatures));
  }

  getCreatureBySlug(slug: string): Promise<Creature | null> {
    return Promise.resolve(
      this.dataset.creatures.find((creature) => creature.slug === slug) ?? null,
    );
  }

  getCollections(): Promise<readonly Collection[]> {
    return Promise.resolve(byOrder(this.dataset.collections));
  }

  getTimelineEvents(): Promise<readonly TimelineEvent[]> {
    return Promise.resolve(
      [...this.dataset.timelineEvents].sort(
        (left, right) => left.chronologyOrder - right.chronologyOrder,
      ),
    );
  }

  getRegions(): Promise<readonly Region[]> {
    return Promise.resolve(byOrder(this.dataset.regions));
  }

  getFactions(): Promise<readonly Faction[]> {
    return Promise.resolve(byOrder(this.dataset.factions));
  }

  getLocations(): Promise<readonly Location[]> {
    return Promise.resolve(byOrder(this.dataset.locations));
  }

  getGalleryItems(): Promise<readonly GalleryItem[]> {
    return Promise.resolve(byOrder(this.dataset.galleryItems));
  }

  getGuardians(): Promise<readonly Guardian[]> {
    return Promise.resolve(byOrder(this.dataset.guardians));
  }

  getWeapons(): Promise<readonly Weapon[]> {
    return Promise.resolve(byOrder(this.dataset.weapons));
  }

  getRelationships(): Promise<readonly Relationship[]> {
    return Promise.resolve(byOrder(this.dataset.relationships));
  }

  getPrintProfiles(): Promise<readonly PrintProfile[]> {
    return Promise.resolve(byOrder(this.dataset.printProfiles));
  }
}

export async function createContentRepository(
  adapter: ContentSourceAdapter,
): Promise<ContentRepository> {
  return new InMemoryContentRepository(await adapter.load());
}

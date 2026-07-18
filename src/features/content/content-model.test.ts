import { mockContentDataset } from '@/features/content/data/content.mock';
import {
  ContentIntegrityError,
  validateContentIntegrity,
} from '@/features/content/domain/content-integrity';
import {
  characterSchema,
  contentDatasetSchema,
  editorialStatusSchema,
} from '@/features/content/domain/content-schemas';
import type { ContentDataset } from '@/features/content/domain/content-types';
import { CmsContentAdapter } from '@/features/content/repository/future-content-adapters';
import {
  createContentRepository,
  InMemoryContentRepository,
} from '@/features/content/repository/in-memory-content-repository';
import { LocalContentAdapter } from '@/features/content/repository/local-content-adapter';

describe('content schemas', () => {
  it('validates the complete local dataset and required entity counts', () => {
    const result = contentDatasetSchema.safeParse(mockContentDataset);
    expect(result.success).toBe(true);
    expect(mockContentDataset.kingdoms).toHaveLength(3);
    expect(mockContentDataset.characters).toHaveLength(4);
    expect(mockContentDataset.creatures).toHaveLength(4);
    expect(mockContentDataset.collections).toHaveLength(2);
    expect(mockContentDataset.timelineEvents).toHaveLength(5);
    expect(mockContentDataset.loreArticles).toHaveLength(2);
  });

  it('accepts only the four editorial statuses', () => {
    expect(editorialStatusSchema.options).toEqual([
      'draft',
      'review',
      'published',
      'archived',
    ]);
    expect(editorialStatusSchema.safeParse('scheduled').success).toBe(false);
  });

  it('rejects malformed slugs and incomplete characters', () => {
    const invalidCharacter = {
      ...mockContentDataset.characters[0],
      slug: 'Invalid Slug',
    };
    expect(characterSchema.safeParse(invalidCharacter).success).toBe(false);
  });
});

describe('content integrity', () => {
  it('has globally unique slugs and valid references', () => {
    expect(validateContentIntegrity(mockContentDataset)).toEqual([]);
    const slugs = Object.values(mockContentDataset)
      .flat()
      .map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('detects broken entity references', () => {
    const broken = structuredClone(mockContentDataset) as ContentDataset;
    broken.characters[0]!.kingdomId = 'kingdom-missing';
    expect(validateContentIntegrity(broken)).toContainEqual({
      path: 'character-far-watcher.kingdomId',
      message: 'Missing kingdom reference: kingdom-missing',
    });
  });

  it('models character-character, creature-character, and kingdom-kingdom relationships', () => {
    const relationshipPairs = mockContentDataset.relationships.map(
      ({ source, target }) => `${source.type}:${target.type}`,
    );
    expect(relationshipPairs).toContain('character:character');
    expect(relationshipPairs).toContain('creature:character');
    expect(relationshipPairs).toContain('kingdom:kingdom');
  });
});

describe('content repository', () => {
  it('serves local records behind the repository interface', async () => {
    const repository = await createContentRepository(new LocalContentAdapter());
    await expect(repository.getCharacters()).resolves.toHaveLength(4);
    await expect(
      repository.getCharacterBySlug('character-far-watcher'),
    ).resolves.toMatchObject({
      title: 'The Far Watcher',
    });
    await expect(repository.getKingdoms()).resolves.toHaveLength(3);
    await expect(repository.getKingdomBySlug('missing')).resolves.toBeNull();
    await expect(repository.getCreatures()).resolves.toHaveLength(4);
    await expect(
      repository.getCreatureBySlug('creature-fog-stalker'),
    ).resolves.toMatchObject({
      threatLevel: 'severe',
    });
    await expect(repository.getCollections()).resolves.toHaveLength(2);
    await expect(repository.getTimelineEvents()).resolves.toHaveLength(5);
  });

  it('allows a future CMS adapter without changing repository consumers', async () => {
    const adapter = new CmsContentAdapter(async () => mockContentDataset);
    const repository = await createContentRepository(adapter);
    expect(repository).toBeInstanceOf(InMemoryContentRepository);
    await expect(repository.getKingdoms()).resolves.toHaveLength(3);
  });

  it('blocks construction when local integrity is invalid', async () => {
    class BrokenLocalAdapter extends LocalContentAdapter {
      override async load(): Promise<ContentDataset> {
        const broken = structuredClone(mockContentDataset) as ContentDataset;
        broken.characters[0]!.kingdomId = 'missing';
        const issues = validateContentIntegrity(broken);
        throw new ContentIntegrityError(issues);
      }
    }

    await expect(
      createContentRepository(new BrokenLocalAdapter()),
    ).rejects.toBeInstanceOf(ContentIntegrityError);
  });
});

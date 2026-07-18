import { cache } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import {
  getCollectionPresentation,
  getMiniature,
  mockMiniatures,
} from '@/features/collections/data/collections.mock';

export const getCollectionPageData = cache(async (slug: string) => {
  const repository = await getContentRepository();
  const [collections, characters, creatures] = await Promise.all([
    repository.getCollections(),
    repository.getCharacters(),
    repository.getCreatures(),
  ]);
  const collection = collections.find((item) => item.slug === slug);
  if (!collection) return null;
  return {
    collection,
    presentation: getCollectionPresentation(slug),
    miniatures: mockMiniatures.filter((item) =>
      item.collectionIds.includes(collection.id),
    ),
    included: collection.itemRefs.flatMap((ref) => {
      const entity =
        ref.type === 'character'
          ? characters.find((item) => item.id === ref.id)
          : creatures.find((item) => item.id === ref.id);
      return entity ? [entity] : [];
    }),
    related: collections.filter((item) => item.id !== collection.id),
  };
});
export const getMiniaturePageData = cache(async (slug: string) => {
  const miniature = getMiniature(slug);
  if (!miniature) return null;
  const repository = await getContentRepository();
  const [characters, creatures, collections] = await Promise.all([
    repository.getCharacters(),
    repository.getCreatures(),
    repository.getCollections(),
  ]);
  const related =
    miniature.relatedEntity.type === 'character'
      ? characters.find((item) => item.id === miniature.relatedEntity.id)
      : creatures.find((item) => item.id === miniature.relatedEntity.id);
  return {
    miniature,
    related: related ?? null,
    collections: collections.filter((item) =>
      miniature.collectionIds.includes(item.id),
    ),
  };
});

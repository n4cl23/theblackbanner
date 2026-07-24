import { cache } from 'react';

import {
  getAllRealCollections,
  getMiniatureBySlug,
  getMiniaturesByCollection,
  getPublishedCollections,
} from '@/features/collections/data/miniature-repository';

export const getCollectionPageData = cache(
  async (slug: string, locale = 'pt-br') => {
    const collections = await getPublishedCollections(locale);
    const collection =
      collections.find((record) => record.slug === slug) ?? null;
    if (!collection) return null;
    return {
      collection,
      miniatures: await getMiniaturesByCollection(slug, locale),
      related: collections.filter((record) => record.slug !== slug),
    };
  },
);

export const getMiniaturePageData = cache(
  async (slug: string, locale = 'pt-br') => {
    const miniature = await getMiniatureBySlug(slug, locale);
    if (!miniature) return null;
    const collections = await getAllRealCollections(locale);
    return {
      miniature,
      collection:
        collections.find(
          (record) => record.slug === miniature.collectionSlug,
        ) ?? null,
    };
  },
);

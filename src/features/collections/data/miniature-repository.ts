import { cache } from 'react';

import catalogSource from './real-miniatures.generated.json';
import {
  miniatureCollectionSchema,
  realCollectionSchema,
  type Miniature,
} from '@/features/collections/domain/miniature-schema';

const allMiniatures = miniatureCollectionSchema.parse(catalogSource.miniatures);
const allCollections = realCollectionSchema.array().parse(
  catalogSource.collections,
);

export interface MiniatureFilters {
  collections: readonly string[];
  entityTypes: readonly Miniature['entityType'][];
  scales: readonly string[];
  difficulties: readonly NonNullable<Miniature['difficulty']>[];
  statuses: readonly Miniature['status'][];
}

export const getAllMiniatures = cache(async (locale = 'pt-br') =>
  allMiniatures.filter((item) => item.locale === locale),
);

export const getMiniatures = cache(async (locale = 'pt-br') =>
  (await getAllMiniatures(locale)).filter(
    (item) => item.status === 'published' && item.cover && item.description,
  ),
);

export const getAllRealCollections = cache(async (locale = 'pt-br') =>
  allCollections.filter((item) => item.locale === locale),
);

export const getPublishedCollections = cache(async (locale = 'pt-br') =>
  (await getAllRealCollections(locale)).filter(
    (item) => item.status === 'published' && item.cover && item.description,
  ),
);

export const getMiniatureBySlug = cache(
  async (slug: string, locale = 'pt-br') =>
    (await getMiniatures(locale)).find((item) => item.slug === slug) ?? null,
);

export const getDraftMiniatureBySlug = cache(
  async (slug: string, locale = 'pt-br') =>
    (await getAllMiniatures(locale)).find((item) => item.slug === slug) ?? null,
);

export const getFeaturedMiniatures = cache(async (locale = 'pt-br') =>
  (await getMiniatures(locale)).slice(0, 4),
);

export const getMiniaturesByCollection = cache(
  async (collectionSlug: string, locale = 'pt-br') =>
    (await getMiniatures(locale)).filter(
      (item) => item.collectionSlug === collectionSlug,
    ),
);

export const getMiniaturesByEntity = cache(
  async (entitySlug: string, locale = 'pt-br') =>
    (await getMiniatures(locale)).filter(
      (item) => item.entitySlug === entitySlug,
    ),
);

export const getMiniatureFilters = cache(
  async (locale = 'pt-br'): Promise<MiniatureFilters> => {
    const records = await getMiniatures(locale);
    const unique = <T extends string>(values: readonly T[]) =>
      [...new Set(values)].sort();
    return {
      collections: unique(records.map((item) => item.collectionSlug)),
      entityTypes: unique(records.map((item) => item.entityType)),
      scales: unique(records.flatMap((item) => (item.scale ? [item.scale] : []))),
      difficulties: unique(
        records.flatMap((item) => (item.difficulty ? [item.difficulty] : [])),
      ),
      statuses: unique(records.map((item) => item.status)),
    };
  },
);

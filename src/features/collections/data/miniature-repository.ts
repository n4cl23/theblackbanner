import { cache } from 'react';

import { mockMiniatures } from '@/features/collections/data/collections.mock';
import type { Miniature } from '@/features/collections/domain/miniature-schema';

export interface MiniatureFilters {
  collections: readonly string[];
  entityTypes: readonly Miniature['entityType'][];
  scales: readonly string[];
  difficulties: readonly Miniature['printDifficulty'][];
  availabilities: readonly Miniature['availability'][];
  kingdoms: readonly string[];
}

export const getMiniatures = cache(async (locale = 'pt-br') =>
  mockMiniatures.filter(
    (item) => item.locale === locale && item.status === 'published',
  ),
);
export const getMiniatureBySlug = cache(
  async (slug: string, locale = 'pt-br') =>
    (await getMiniatures(locale)).find((item) => item.slug === slug) ?? null,
);
export const getFeaturedMiniatures = cache(async (locale = 'pt-br') =>
  (await getMiniatures(locale)).filter((item) => item.featured),
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
      scales: unique(records.map((item) => item.scale)),
      difficulties: unique(records.map((item) => item.printDifficulty)),
      availabilities: unique(records.map((item) => item.availability)),
      kingdoms: unique(records.map((item) => item.kingdomSlug)),
    };
  },
);

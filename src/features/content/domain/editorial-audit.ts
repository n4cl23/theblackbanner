import type {
  ContentDataset,
  EditorialCore,
} from '@/features/content/domain/content-types';
import { validateContentIntegrity } from './content-integrity';
import { validateDatasetPublication } from './publication-policy';

export const editorialCollections = [
  'characters',
  'creatures',
  'kingdoms',
  'regions',
  'collections',
  'weapons',
  'crowns',
  'guardians',
  'timelineEvents',
  'loreArticles',
  'galleryItems',
  'mediaAssets',
  'printProfiles',
  'factions',
  'locations',
  'relationships',
  'tags',
  'categories',
] as const satisfies readonly (keyof ContentDataset)[];

export interface EditorialAudit {
  totalEntities: number;
  byType: Record<(typeof editorialCollections)[number], number>;
  byStatus: Record<'draft' | 'review' | 'published' | 'archived', number>;
  duplicateSlugs: number;
  brokenReferences: number;
  publicationBlocks: number;
  unassignedCharacters: number;
  creaturesWithoutRegions: number;
  eventsWithoutParticipants: number;
}

export function auditEditorialDataset(dataset: ContentDataset): EditorialAudit {
  const entities: EditorialCore[] = [];
  for (const key of editorialCollections)
    entities.push(...(dataset[key] as readonly EditorialCore[]));
  const byStatus = { draft: 0, review: 0, published: 0, archived: 0 };
  entities.forEach((entity) => {
    byStatus[entity.status] += 1;
  });
  const integrity = validateContentIntegrity(dataset);

  return {
    totalEntities: entities.length,
    byType: Object.fromEntries(
      editorialCollections.map((key) => [key, dataset[key].length]),
    ) as EditorialAudit['byType'],
    byStatus,
    duplicateSlugs: integrity.filter((issue) =>
      issue.message.startsWith('Duplicate slug'),
    ).length,
    brokenReferences: integrity.filter((issue) =>
      issue.message.startsWith('Missing'),
    ).length,
    publicationBlocks: validateDatasetPublication(dataset).length,
    unassignedCharacters: dataset.characters.filter(
      (item) => !item.kingdomId || item.factionIds.length === 0,
    ).length,
    creaturesWithoutRegions: dataset.creatures.filter(
      (item) => item.regionIds.length === 0,
    ).length,
    eventsWithoutParticipants: dataset.timelineEvents.filter(
      (item) => item.entityRefs.length < 2,
    ).length,
  };
}

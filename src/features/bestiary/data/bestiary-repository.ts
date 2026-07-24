import { cache } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import {
  getBiomePresentation,
  getCreaturePresentation,
} from '@/features/bestiary/data/bestiary-presentation.mock';

export const getCreaturePageData = cache(async (slug: string) => {
  const repository = await getContentRepository();
  const [
    creature,
    kingdoms,
    regions,
    relationships,
    characters,
    collections,
    profiles,
    allCreatures,
  ] = await Promise.all([
    repository.getCreatureBySlug(slug),
    repository.getKingdoms(),
    repository.getRegions(),
    repository.getRelationships(),
    repository.getCharacters(),
    repository.getCollections(),
    repository.getPrintProfiles(),
    repository.getCreatures(),
  ]);
  if (!creature) return null;
  return {
    creature,
    presentation: getCreaturePresentation(slug),
    kingdoms: kingdoms.filter((item) =>
      creature.kingdomBestiaryIds.includes(item.id),
    ),
    regions: regions.filter((item) => creature.regionIds.includes(item.id)),
    relationships: relationships.filter((item) =>
      creature.characterRelationshipIds.includes(item.id),
    ),
    characters,
    collections: collections.filter((item) =>
      item.itemRefs.some(
        (ref) => ref.type === 'creature' && ref.id === creature.id,
      ),
    ),
    profiles,
    related: allCreatures.filter(
      (item) =>
        item.id !== creature.id &&
        item.regionIds.some((id) => creature.regionIds.includes(id)),
    ),
  };
});

export const getAtlasPageData = cache(async (kingdomSlug: string) => {
  const repository = await getContentRepository();
  const [kingdom, regions, creatures] = await Promise.all([
    repository.getKingdomBySlug(kingdomSlug),
    repository.getRegions(),
    repository.getCreatures(),
  ]);
  if (!kingdom) return null;
  const localCreatures = creatures.filter((item) =>
    item.kingdomBestiaryIds.includes(kingdom.id),
  );
  return {
    kingdom,
    biome: getBiomePresentation(kingdomSlug),
    regions: regions.filter((item) => item.kingdomId === kingdom.id),
    creatures: localCreatures,
  };
});

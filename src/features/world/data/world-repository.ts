import { getContentRepository } from '@/features/content/repository/repository';
import { getKingdomPresentation } from '@/features/world/data/world-presentation.mock';

export const getKingdomPageData = cache(async (slug: string) => {
  const repository = await getContentRepository();
  const [kingdom, regions, factions, characters, creatures, events, gallery] =
    await Promise.all([
      repository.getKingdomBySlug(slug),
      repository.getRegions(),
      repository.getFactions(),
      repository.getCharacters(),
      repository.getCreatures(),
      repository.getTimelineEvents(),
      repository.getGalleryItems(),
    ]);
  if (!kingdom) return null;
  return {
    kingdom,
    presentation: getKingdomPresentation(slug),
    regions: regions.filter((item) => item.kingdomId === kingdom.id),
    factions: factions.filter((item) => item.kingdomId === kingdom.id),
    characters: characters.filter((item) => item.kingdomId === kingdom.id),
    creatures: creatures.filter((item) =>
      item.kingdomBestiaryIds.includes(kingdom.id),
    ),
    events: events.filter(
      (item) =>
        item.entityRefs.some(
          (ref) => ref.type === 'kingdom' && ref.id === kingdom.id,
        ) ||
        item.entityRefs.some(
          (ref) =>
            ref.type === 'character' &&
            characters.some((character) => character.id === ref.id),
        ),
    ),
    gallery: gallery.filter((item) =>
      item.relatedEntityRefs.some(
        (ref) => ref.type === 'kingdom' && ref.id === kingdom.id,
      ),
    ),
  };
});
import { cache } from 'react';

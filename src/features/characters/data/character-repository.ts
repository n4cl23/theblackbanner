import { cache } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import { getCharacterPresentation } from '@/features/characters/data/character-presentation.mock';

export const getCharacterPageData = cache(async (slug: string) => {
  const repository = await getContentRepository();
  const [
    character,
    kingdoms,
    factions,
    weapons,
    events,
    relationships,
    collections,
    printProfiles,
    allCharacters,
  ] = await Promise.all([
    repository.getCharacterBySlug(slug),
    repository.getKingdoms(),
    repository.getFactions(),
    repository.getWeapons(),
    repository.getTimelineEvents(),
    repository.getRelationships(),
    repository.getCollections(),
    repository.getPrintProfiles(),
    repository.getCharacters(),
  ]);
  if (!character) return null;
  return {
    character,
    presentation: getCharacterPresentation(slug),
    kingdom: kingdoms.find((item) => item.id === character.kingdomId) ?? null,
    factions: factions.filter((item) => character.factionIds.includes(item.id)),
    weapons: weapons.filter((item) => character.weaponIds.includes(item.id)),
    events: events.filter((item) => character.eventIds.includes(item.id)),
    relationships: relationships.filter((item) =>
      character.relationshipIds.includes(item.id),
    ),
    collections: collections.filter((item) =>
      item.itemRefs.some(
        (ref) => ref.type === 'character' && ref.id === character.id,
      ),
    ),
    printProfiles,
    related: allCharacters.filter(
      (item) =>
        item.kingdomId === character.kingdomId && item.id !== character.id,
    ),
  };
});

export const getGuardianPageData = cache(async (slug: string) => {
  const repository = await getContentRepository();
  const [guardians, characters, events] = await Promise.all([
    repository.getGuardians(),
    repository.getCharacters(),
    repository.getTimelineEvents(),
  ]);
  const guardian = guardians.find((item) => item.slug === slug);
  if (!guardian) return null;
  return {
    guardian,
    linkedCharacter:
      characters.find((item) => item.id === guardian.characterId) ?? null,
    events: events.filter((event) =>
      event.entityRefs.some((ref) => ref.id === guardian.characterId),
    ),
  };
});

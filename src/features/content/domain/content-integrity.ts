import type {
  ContentDataset,
  EntityReference,
} from '@/features/content/domain/content-types';

export type ContentIntegrityIssue = Readonly<{
  path: string;
  message: string;
}>;

type EntityRegistry = ReadonlyMap<string, ReadonlySet<string>>;

function buildRegistry(dataset: ContentDataset): EntityRegistry {
  return new Map([
    ['character', new Set(dataset.characters.map(({ id }) => id))],
    ['creature', new Set(dataset.creatures.map(({ id }) => id))],
    ['kingdom', new Set(dataset.kingdoms.map(({ id }) => id))],
    ['region', new Set(dataset.regions.map(({ id }) => id))],
    ['collection', new Set(dataset.collections.map(({ id }) => id))],
    ['weapon', new Set(dataset.weapons.map(({ id }) => id))],
    ['crown', new Set(dataset.crowns.map(({ id }) => id))],
    ['guardian', new Set(dataset.guardians.map(({ id }) => id))],
    ['timelineEvent', new Set(dataset.timelineEvents.map(({ id }) => id))],
    ['loreArticle', new Set(dataset.loreArticles.map(({ id }) => id))],
    ['galleryItem', new Set(dataset.galleryItems.map(({ id }) => id))],
    ['mediaAsset', new Set(dataset.mediaAssets.map(({ id }) => id))],
    ['printProfile', new Set(dataset.printProfiles.map(({ id }) => id))],
    ['faction', new Set(dataset.factions.map(({ id }) => id))],
    ['location', new Set(dataset.locations.map(({ id }) => id))],
    ['relationship', new Set(dataset.relationships.map(({ id }) => id))],
    ['tag', new Set(dataset.tags.map(({ id }) => id))],
    ['category', new Set(dataset.categories.map(({ id }) => id))],
  ]);
}

export function validateContentIntegrity(
  dataset: ContentDataset,
): readonly ContentIntegrityIssue[] {
  const issues: ContentIntegrityIssue[] = [];
  const registry = buildRegistry(dataset);
  const allEntities = Object.values(dataset).flat();
  const slugs = new Map<string, string>();

  function requireReference(reference: EntityReference, path: string) {
    if (!registry.get(reference.type)?.has(reference.id)) {
      issues.push({
        path,
        message: `Missing ${reference.type} reference: ${reference.id}`,
      });
    }
  }

  function requireId(type: string, id: string | null, path: string) {
    if (id && !registry.get(type)?.has(id)) {
      issues.push({ path, message: `Missing ${type} reference: ${id}` });
    }
  }

  for (const entity of allEntities) {
    const previous = slugs.get(entity.slug);
    if (previous) {
      issues.push({
        path: `${entity.id}.slug`,
        message: `Duplicate slug "${entity.slug}" also used by ${previous}`,
      });
    } else {
      slugs.set(entity.slug, entity.id);
    }
    for (const tagId of entity.tags)
      requireId('tag', tagId, `${entity.id}.tags`);
    if (entity.cover)
      requireId('mediaAsset', entity.cover.id, `${entity.id}.cover`);
    for (const item of entity.gallery)
      requireId('mediaAsset', item.id, `${entity.id}.gallery`);
  }

  for (const character of dataset.characters) {
    requireId('kingdom', character.kingdomId, `${character.id}.kingdomId`);
    character.factionIds.forEach((id) =>
      requireId('faction', id, `${character.id}.factionIds`),
    );
    character.eventIds.forEach((id) =>
      requireId('timelineEvent', id, `${character.id}.eventIds`),
    );
    character.weaponIds.forEach((id) =>
      requireId('weapon', id, `${character.id}.weaponIds`),
    );
    character.relationshipIds.forEach((id) =>
      requireId('relationship', id, `${character.id}.relationshipIds`),
    );
  }

  for (const creature of dataset.creatures) {
    creature.regionIds.forEach((id) =>
      requireId('region', id, `${creature.id}.regionIds`),
    );
    creature.kingdomBestiaryIds.forEach((id) =>
      requireId('kingdom', id, `${creature.id}.kingdomBestiaryIds`),
    );
    creature.characterRelationshipIds.forEach((id) =>
      requireId('relationship', id, `${creature.id}.characterRelationshipIds`),
    );
  }

  for (const kingdom of dataset.kingdoms) {
    kingdom.regionIds.forEach((id) =>
      requireId('region', id, `${kingdom.id}.regionIds`),
    );
    kingdom.factionIds.forEach((id) =>
      requireId('faction', id, `${kingdom.id}.factionIds`),
    );
    requireId(
      'character',
      kingdom.rulerCharacterId,
      `${kingdom.id}.rulerCharacterId`,
    );
    kingdom.relationshipIds.forEach((id) =>
      requireId('relationship', id, `${kingdom.id}.relationshipIds`),
    );
  }

  for (const region of dataset.regions) {
    requireId('kingdom', region.kingdomId, `${region.id}.kingdomId`);
    region.locationIds.forEach((id) =>
      requireId('location', id, `${region.id}.locationIds`),
    );
  }

  for (const collection of dataset.collections) {
    collection.itemRefs.forEach((reference) =>
      requireReference(reference, `${collection.id}.itemRefs`),
    );
    requireId(
      'printProfile',
      collection.printProfileId,
      `${collection.id}.printProfileId`,
    );
  }

  for (const event of dataset.timelineEvents) {
    event.entityRefs.forEach((reference) =>
      requireReference(reference, `${event.id}.entityRefs`),
    );
  }

  for (const article of dataset.loreArticles) {
    article.citedEntityRefs.forEach((reference) =>
      requireReference(reference, `${article.id}.citedEntityRefs`),
    );
    article.categoryIds.forEach((id) =>
      requireId('category', id, `${article.id}.categoryIds`),
    );
  }

  for (const relationship of dataset.relationships) {
    requireReference(relationship.source, `${relationship.id}.source`);
    requireReference(relationship.target, `${relationship.id}.target`);
  }

  for (const faction of dataset.factions) {
    requireId('kingdom', faction.kingdomId, `${faction.id}.kingdomId`);
    faction.memberCharacterIds.forEach((id) =>
      requireId('character', id, `${faction.id}.memberCharacterIds`),
    );
  }

  for (const location of dataset.locations)
    requireId('region', location.regionId, `${location.id}.regionId`);
  for (const weapon of dataset.weapons)
    weapon.ownerCharacterIds.forEach((id) =>
      requireId('character', id, `${weapon.id}.ownerCharacterIds`),
    );
  for (const crown of dataset.crowns) {
    requireId('kingdom', crown.kingdomId, `${crown.id}.kingdomId`);
    requireId(
      'character',
      crown.bearerCharacterId,
      `${crown.id}.bearerCharacterId`,
    );
  }
  for (const guardian of dataset.guardians) {
    requireId('character', guardian.characterId, `${guardian.id}.characterId`);
    requireId('creature', guardian.creatureId, `${guardian.id}.creatureId`);
    requireId('location', guardian.locationId, `${guardian.id}.locationId`);
  }
  for (const item of dataset.galleryItems) {
    requireId('mediaAsset', item.mediaAssetId, `${item.id}.mediaAssetId`);
    item.relatedEntityRefs.forEach((reference) =>
      requireReference(reference, `${item.id}.relatedEntityRefs`),
    );
  }
  for (const category of dataset.categories)
    requireId(
      'category',
      category.parentCategoryId,
      `${category.id}.parentCategoryId`,
    );

  return issues;
}

export class ContentIntegrityError extends Error {
  constructor(readonly issues: readonly ContentIntegrityIssue[]) {
    super(
      `Content integrity validation failed with ${issues.length} issue(s).`,
    );
    this.name = 'ContentIntegrityError';
  }
}

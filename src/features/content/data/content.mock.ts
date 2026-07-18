import type {
  ContentDataset,
  EditorialCore,
} from '@/features/content/domain/content-types';

const timestamp = '2026-07-17T00:00:00.000Z';

function mockCore(
  id: string,
  title: string,
  order: number,
  tags: string[] = [],
): EditorialCore {
  return {
    id,
    slug: id,
    title,
    subtitle: 'Conteúdo editorial provisório',
    excerpt: `Resumo provisório de ${title}.`,
    description: `${title} é um registro mockado para validar a arquitetura editorial sem estabelecer conteúdo oficial.`,
    status: 'draft',
    locale: 'pt-BR',
    featured: order < 3,
    order,
    tags,
    seo: {
      title: `${title} — Mock editorial`,
      description: `Registro provisório de ${title} para testes da arquitetura de conteúdo.`,
      canonicalPath: `/mock/${id}`,
      noIndex: true,
    },
    cover: null,
    gallery: [],
    provenance: 'mock',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const mockContentDataset = {
  mediaAssets: [
    {
      ...mockCore('asset-hero', 'Paisagem de Asterheim', 0),
      kind: 'mediaAsset',
      mediaType: 'image',
      path: '/images/home/asterheim-hero.webp',
      mimeType: 'image/webp',
      width: 1920,
      height: 818,
      durationSeconds: null,
    },
  ],
  tags: [
    { ...mockCore('tag-war', 'Guerra', 0), kind: 'tag', label: 'Guerra' },
    { ...mockCore('tag-ruin', 'Ruínas', 1), kind: 'tag', label: 'Ruínas' },
    {
      ...mockCore('tag-road', 'Exploração', 2),
      kind: 'tag',
      label: 'Exploração',
    },
  ],
  categories: [
    {
      ...mockCore('category-chronicle', 'Crônicas', 0),
      kind: 'category',
      label: 'Crônicas',
      parentCategoryId: null,
    },
  ],
  regions: [
    {
      ...mockCore('region-ashen-reach', 'Campos de Cinza', 0, ['tag-ruin']),
      kind: 'region',
      kingdomId: 'kingdom-ashen-reach',
      locationIds: ['location-black-gate'],
      climate: 'Frio, cinzas suspensas e baixa visibilidade',
    },
    {
      ...mockCore('region-iron-march', 'Marchas de Ferro', 1, ['tag-war']),
      kind: 'region',
      kingdomId: 'kingdom-iron-march',
      locationIds: ['location-sunken-road'],
      climate: 'Tempestades persistentes e planícies alagadas',
    },
    {
      ...mockCore('region-veiled-crown', 'Bosque Petrificado', 2, ['tag-road']),
      kind: 'region',
      kingdomId: 'kingdom-veiled-crown',
      locationIds: ['location-bone-forest'],
      climate: 'Névoa noturna e solo encharcado',
    },
  ],
  locations: [
    {
      ...mockCore('location-black-gate', 'Portão Negro', 0),
      kind: 'location',
      regionId: 'region-ashen-reach',
      coordinates: { x: 18, y: 42 },
    },
    {
      ...mockCore('location-sunken-road', 'Estrada Afogada', 1),
      kind: 'location',
      regionId: 'region-iron-march',
      coordinates: { x: 51, y: 37 },
    },
    {
      ...mockCore('location-bone-forest', 'Mata dos Ossos', 2),
      kind: 'location',
      regionId: 'region-veiled-crown',
      coordinates: null,
    },
  ],
  factions: [
    {
      ...mockCore('faction-road-watch', 'Vigília da Estrada', 0),
      kind: 'faction',
      kingdomId: 'kingdom-ashen-reach',
      memberCharacterIds: ['character-far-watcher', 'character-ash-scout'],
    },
    {
      ...mockCore('faction-banner-guard', 'Guarda do Estandarte', 1),
      kind: 'faction',
      kingdomId: 'kingdom-iron-march',
      memberCharacterIds: ['character-banner-bearer'],
    },
    {
      ...mockCore('faction-veil-court', 'Corte Velada', 2),
      kind: 'faction',
      kingdomId: 'kingdom-veiled-crown',
      memberCharacterIds: ['character-veil-keeper'],
    },
  ],
  weapons: [
    {
      ...mockCore('weapon-road-spear', 'Lança da Estrada', 0),
      kind: 'weapon',
      ownerCharacterIds: ['character-far-watcher', 'character-ash-scout'],
      weaponType: 'Lança de reconhecimento',
    },
    {
      ...mockCore('weapon-banner-blade', 'Lâmina do Estandarte', 1),
      kind: 'weapon',
      ownerCharacterIds: ['character-banner-bearer'],
      weaponType: 'Espada longa',
    },
  ],
  relationships: [
    {
      ...mockCore('relationship-watcher-scout', 'Vínculo de vigília', 0),
      kind: 'ally',
      source: { type: 'character', id: 'character-far-watcher' },
      target: { type: 'character', id: 'character-ash-scout' },
      reciprocal: true,
    },
    {
      ...mockCore('relationship-stalker-watcher', 'Caçada na névoa', 1),
      kind: 'hunts',
      source: { type: 'creature', id: 'creature-fog-stalker' },
      target: { type: 'character', id: 'character-far-watcher' },
      reciprocal: false,
    },
    {
      ...mockCore('relationship-ashen-iron', 'Fronteira contestada', 2),
      kind: 'contested',
      source: { type: 'kingdom', id: 'kingdom-ashen-reach' },
      target: { type: 'kingdom', id: 'kingdom-iron-march' },
      reciprocal: true,
    },
  ],
  kingdoms: [
    {
      ...mockCore('kingdom-ashen-reach', 'The Ashen Reach', 0, ['tag-ruin']),
      kind: 'kingdom',
      regionIds: ['region-ashen-reach'],
      factionIds: ['faction-road-watch'],
      rulerCharacterId: null,
      relationshipIds: ['relationship-ashen-iron'],
      sigil: 'ᚨ',
    },
    {
      ...mockCore('kingdom-iron-march', 'The Iron March', 1, ['tag-war']),
      kind: 'kingdom',
      regionIds: ['region-iron-march'],
      factionIds: ['faction-banner-guard'],
      rulerCharacterId: null,
      relationshipIds: ['relationship-ashen-iron'],
      sigil: 'ᛏ',
    },
    {
      ...mockCore('kingdom-veiled-crown', 'The Veiled Crown', 2, ['tag-road']),
      kind: 'kingdom',
      regionIds: ['region-veiled-crown'],
      factionIds: ['faction-veil-court'],
      rulerCharacterId: null,
      relationshipIds: [],
      sigil: 'ᚱ',
    },
  ],
  characters: [
    {
      ...mockCore('character-far-watcher', 'The Far Watcher', 0, ['tag-road']),
      kind: 'character',
      kingdomId: 'kingdom-ashen-reach',
      factionIds: ['faction-road-watch'],
      eventIds: ['event-road-opens', 'event-first-silence'],
      weaponIds: ['weapon-road-spear'],
      relationshipIds: [
        'relationship-watcher-scout',
        'relationship-stalker-watcher',
      ],
      role: 'Pathfinder',
    },
    {
      ...mockCore('character-banner-bearer', 'The Banner Bearer', 1, [
        'tag-war',
      ]),
      kind: 'character',
      kingdomId: 'kingdom-iron-march',
      factionIds: ['faction-banner-guard'],
      eventIds: ['event-banner-falls', 'event-crown-vanishes'],
      weaponIds: ['weapon-banner-blade'],
      relationshipIds: [],
      role: 'Witness',
    },
    {
      ...mockCore('character-ash-scout', 'The Ash Scout', 2, ['tag-ruin']),
      kind: 'character',
      kingdomId: 'kingdom-ashen-reach',
      factionIds: ['faction-road-watch'],
      eventIds: ['event-first-silence', 'event-road-opens'],
      weaponIds: ['weapon-road-spear'],
      relationshipIds: ['relationship-watcher-scout'],
      role: 'Scout',
    },
    {
      ...mockCore('character-veil-keeper', 'The Veil Keeper', 3, ['tag-road']),
      kind: 'character',
      kingdomId: 'kingdom-veiled-crown',
      factionIds: ['faction-veil-court'],
      eventIds: ['event-crown-vanishes', 'event-bones-found'],
      weaponIds: [],
      relationshipIds: [],
      role: 'Archivist',
    },
  ],
  creatures: [
    {
      ...mockCore('creature-bone-below', 'The Bone Below', 0, ['tag-ruin']),
      kind: 'creature',
      regionIds: ['region-veiled-crown'],
      kingdomBestiaryIds: ['kingdom-veiled-crown'],
      characterRelationshipIds: [],
      classification: 'Vestígio não classificado',
      threatLevel: 'unknown',
    },
    {
      ...mockCore('creature-fog-stalker', 'The Fog Stalker', 1, ['tag-road']),
      kind: 'creature',
      regionIds: ['region-iron-march'],
      kingdomBestiaryIds: ['kingdom-iron-march'],
      characterRelationshipIds: ['relationship-stalker-watcher'],
      classification: 'Predador territorial',
      threatLevel: 'severe',
    },
    {
      ...mockCore('creature-ash-hound', 'The Ash Hound', 2, ['tag-war']),
      kind: 'creature',
      regionIds: ['region-ashen-reach'],
      kingdomBestiaryIds: ['kingdom-ashen-reach'],
      characterRelationshipIds: [],
      classification: 'Caçador de matilha',
      threatLevel: 'severe',
    },
    {
      ...mockCore('creature-marsh-colossus', 'The Marsh Colossus', 3, [
        'tag-ruin',
      ]),
      kind: 'creature',
      regionIds: ['region-iron-march'],
      kingdomBestiaryIds: ['kingdom-iron-march'],
      characterRelationshipIds: [],
      classification: 'Entidade monumental',
      threatLevel: 'extreme',
    },
  ],
  printProfiles: [
    {
      ...mockCore('print-profile-32mm', 'Perfil de impressão 32 mm', 0),
      kind: 'printProfile',
      scale: '32mm',
      supportStrategy: 'medium',
      fileFormat: 'stl',
    },
  ],
  collections: [
    {
      ...mockCore('collection-vanguard', 'Vanguard Studies', 0),
      kind: 'collection',
      itemRefs: [
        { type: 'character', id: 'character-far-watcher' },
        { type: 'character', id: 'character-banner-bearer' },
      ],
      printProfileId: 'print-profile-32mm',
    },
    {
      ...mockCore('collection-beasts', 'Beasts of the Road', 1),
      kind: 'collection',
      itemRefs: [
        { type: 'creature', id: 'creature-fog-stalker' },
        { type: 'creature', id: 'creature-ash-hound' },
      ],
      printProfileId: 'print-profile-32mm',
    },
  ],
  timelineEvents: [
    {
      ...mockCore('event-first-silence', 'The First Silence', 0),
      kind: 'timelineEvent',
      dateLabel: 'Era desconhecida',
      chronologyOrder: 10,
      entityRefs: [
        { type: 'character', id: 'character-ash-scout' },
        { type: 'kingdom', id: 'kingdom-ashen-reach' },
      ],
    },
    {
      ...mockCore('event-road-opens', 'The Black Road Opens', 1),
      kind: 'timelineEvent',
      dateLabel: 'Ano não registrado',
      chronologyOrder: 20,
      entityRefs: [
        { type: 'character', id: 'character-far-watcher' },
        { type: 'character', id: 'character-ash-scout' },
        { type: 'location', id: 'location-sunken-road' },
      ],
    },
    {
      ...mockCore('event-banner-falls', 'The Banner Falls', 2),
      kind: 'timelineEvent',
      dateLabel: 'Durante a marcha',
      chronologyOrder: 30,
      entityRefs: [
        { type: 'character', id: 'character-banner-bearer' },
        { type: 'kingdom', id: 'kingdom-iron-march' },
      ],
    },
    {
      ...mockCore('event-crown-vanishes', 'The Crown Vanishes', 3),
      kind: 'timelineEvent',
      dateLabel: 'Noite sem lua',
      chronologyOrder: 40,
      entityRefs: [
        { type: 'character', id: 'character-veil-keeper' },
        { type: 'kingdom', id: 'kingdom-veiled-crown' },
      ],
    },
    {
      ...mockCore('event-bones-found', 'The Bones Are Found', 4),
      kind: 'timelineEvent',
      dateLabel: 'Após a queda de cinzas',
      chronologyOrder: 50,
      entityRefs: [
        { type: 'character', id: 'character-veil-keeper' },
        { type: 'creature', id: 'creature-bone-below' },
        { type: 'location', id: 'location-bone-forest' },
      ],
    },
  ],
  loreArticles: [
    {
      ...mockCore('article-roads-and-ruins', 'Roads and Ruins', 0),
      kind: 'loreArticle',
      body: [
        'Parágrafo provisório para validar citações editoriais polimórficas.',
      ],
      citedEntityRefs: [
        { type: 'kingdom', id: 'kingdom-ashen-reach' },
        { type: 'location', id: 'location-sunken-road' },
      ],
      categoryIds: ['category-chronicle'],
    },
    {
      ...mockCore('article-signs-in-fog', 'Signs in the Fog', 1),
      kind: 'loreArticle',
      body: ['Texto mockado sobre sinais e vestígios, sem estabelecer cânone.'],
      citedEntityRefs: [
        { type: 'creature', id: 'creature-fog-stalker' },
        { type: 'character', id: 'character-far-watcher' },
      ],
      categoryIds: ['category-chronicle'],
    },
  ],
  crowns: [
    {
      ...mockCore('crown-veiled', 'The Veiled Crown Relic', 0),
      kind: 'crown',
      kingdomId: 'kingdom-veiled-crown',
      bearerCharacterId: null,
    },
  ],
  guardians: [
    {
      ...mockCore('guardian-black-gate', 'Guardian of the Black Gate', 0),
      kind: 'guardian',
      characterId: 'character-ash-scout',
      creatureId: null,
      locationId: 'location-black-gate',
    },
  ],
  galleryItems: [
    {
      ...mockCore('gallery-asterheim-vista', 'Asterheim Vista', 0),
      kind: 'galleryItem',
      mediaAssetId: 'asset-hero',
      relatedEntityRefs: [
        { type: 'kingdom', id: 'kingdom-ashen-reach' },
        { type: 'character', id: 'character-far-watcher' },
      ],
    },
  ],
} satisfies ContentDataset;

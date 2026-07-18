import {
  chronicleSchema,
  narrativeRelationSchema,
  timelinePresentationSchema,
} from '@/features/lore/domain/lore-schema';

export const timelinePresentations = [
  {
    eventId: 'event-first-silence',
    era: 'Era das Cinzas',
    year: 9,
    impact: 'regional',
    conflict: 'O Primeiro Silêncio',
    kingdomIds: ['kingdom-ashen-reach'],
    characterIds: ['character-ash-scout'],
    creatureIds: [],
    factionIds: ['faction-road-watch'],
    relatedEventIds: ['event-road-opens'],
    provenance: 'mock',
  },
  {
    eventId: 'event-road-opens',
    era: 'Era das Cinzas',
    year: 34,
    impact: 'continental',
    conflict: 'A Estrada Negra',
    kingdomIds: ['kingdom-ashen-reach'],
    characterIds: ['character-far-watcher', 'character-ash-scout'],
    creatureIds: [],
    factionIds: ['faction-road-watch'],
    relatedEventIds: ['event-first-silence', 'event-banner-falls'],
    provenance: 'mock',
  },
  {
    eventId: 'event-banner-falls',
    era: 'Era do Ferro',
    year: 102,
    impact: 'continental',
    conflict: 'A Marcha Partida',
    kingdomIds: ['kingdom-iron-march'],
    characterIds: ['character-banner-bearer'],
    creatureIds: ['creature-fog-stalker'],
    factionIds: ['faction-banner-guard'],
    relatedEventIds: ['event-road-opens', 'event-crown-vanishes'],
    provenance: 'mock',
  },
  {
    eventId: 'event-crown-vanishes',
    era: 'Era do Ferro',
    year: 117,
    impact: 'continental',
    conflict: 'A Marcha Partida',
    kingdomIds: ['kingdom-veiled-crown'],
    characterIds: ['character-banner-bearer', 'character-veil-keeper'],
    creatureIds: [],
    factionIds: ['faction-veil-court'],
    relatedEventIds: ['event-banner-falls', 'event-bones-found'],
    provenance: 'mock',
  },
  {
    eventId: 'event-bones-found',
    era: 'Era do Véu',
    year: 153,
    impact: 'regional',
    conflict: 'O Despertar Ósseo',
    kingdomIds: ['kingdom-veiled-crown'],
    characterIds: ['character-veil-keeper'],
    creatureIds: ['creature-bone-below'],
    factionIds: ['faction-veil-court'],
    relatedEventIds: ['event-crown-vanishes'],
    provenance: 'mock',
  },
] as const;
timelinePresentations.forEach((item) => timelinePresentationSchema.parse(item));

export const narrativeRelations = [
  {
    id: 'relation-watchers-alliance',
    kind: 'ally',
    sourceId: 'character-far-watcher',
    targetId: 'character-ash-scout',
    label: 'Aliança de vigília',
    note: 'Dois batedores mantêm uma rota que nenhum reino reivindica.',
    sourceHref: '/personagens/character-far-watcher',
    targetHref: '/personagens/character-ash-scout',
    provenance: 'mock',
  },
  {
    id: 'relation-stalker-enmity',
    kind: 'enemy',
    sourceId: 'creature-fog-stalker',
    targetId: 'character-far-watcher',
    label: 'Caçada na névoa',
    note: 'Predador e vigia repetem um confronto ainda sem desfecho.',
    sourceHref: '/bestiario/creature-fog-stalker',
    targetHref: '/personagens/character-far-watcher',
    provenance: 'mock',
  },
  {
    id: 'relation-banner-debt',
    kind: 'debt',
    sourceId: 'character-banner-bearer',
    targetId: 'character-veil-keeper',
    label: 'Dívida do estandarte',
    note: 'Uma testemunha deve ao arquivo um nome que foi apagado.',
    sourceHref: '/personagens/character-banner-bearer',
    targetHref: '/personagens/character-veil-keeper',
    provenance: 'mock',
  },
  {
    id: 'relation-bones-bound',
    kind: 'bound-creature',
    sourceId: 'character-veil-keeper',
    targetId: 'creature-bone-below',
    label: 'Criatura vinculada',
    note: 'O achado sob as raízes responde ao mesmo sinal guardado no Véu.',
    sourceHref: '/personagens/character-veil-keeper',
    targetHref: '/bestiario/creature-bone-below',
    provenance: 'mock',
  },
  {
    id: 'relation-kingdom-conflict',
    kind: 'conflict',
    sourceId: 'kingdom-ashen-reach',
    targetId: 'kingdom-iron-march',
    label: 'Fronteira contestada',
    note: 'Cinzas e ferro disputam a passagem da Estrada Negra.',
    sourceHref: '/world/kingdoms/kingdom-ashen-reach',
    targetHref: '/world/kingdoms/kingdom-iron-march',
    provenance: 'mock',
  },
] as const;
narrativeRelations.forEach((item) => narrativeRelationSchema.parse(item));

export const chronicles = chronicleSchema.array().parse([
  {
    id: 'chronicle-black-road',
    slug: 'the-black-road',
    title: 'The Black Road',
    subtitle: 'Uma crônica provisória em três movimentos',
    excerpt:
      'Dois vigias atravessam uma estrada que parece recordar cada passo.',
    estimatedMinutes: 9,
    entityIds: [
      'character-far-watcher',
      'character-ash-scout',
      'event-road-opens',
    ],
    relatedArticleSlugs: ['article-roads-and-ruins'],
    provenance: 'mock',
    chapters: [
      {
        id: 'before-ash',
        title: 'Antes das cinzas',
        body: [
          'A estrada não aparecia nos mapas, mas deixava fuligem nas botas dos que sonhavam com ela.',
          'Ao amanhecer, o Far Watcher encontrou um marco virado para um reino que já não existia.',
        ],
      },
      {
        id: 'the-marker',
        title: 'O marco sem nome',
        body: [
          'A Ash Scout ouviu metal sob a pedra e recusou-se a chamar aquilo de sino.',
          'Juntos, seguiram o som até a névoa fechar a distância entre os pinheiros.',
        ],
      },
      {
        id: 'road-opens',
        title: 'Quando a estrada abriu',
        body: [
          'O chão separou-se sem ruído, revelando lajes negras que desciam para além da luz.',
          'Nenhum dos dois avançou. Ainda assim, suas pegadas surgiram do outro lado.',
        ],
      },
    ],
  },
  {
    id: 'chronicle-fallen-banner',
    slug: 'the-fallen-banner',
    title: 'The Fallen Banner',
    subtitle: 'Testemunho provisório da marcha partida',
    excerpt: 'Um estandarte cai e a memória da batalha muda de dono.',
    estimatedMinutes: 7,
    entityIds: ['character-banner-bearer', 'event-banner-falls'],
    relatedArticleSlugs: ['article-signs-in-fog'],
    provenance: 'mock',
    chapters: [
      {
        id: 'iron-rain',
        title: 'Chuva sobre o ferro',
        body: [
          'A tempestade dobrou as lanças antes que o inimigo fosse visto.',
          'O Banner Bearer contou os trovões para não contar os mortos.',
        ],
      },
      {
        id: 'standard',
        title: 'O peso do estandarte',
        body: [
          'Quando o tecido tocou a lama, cada juramento pareceu perder uma palavra.',
          'Ele o ergueu outra vez, sabendo que o símbolo já pertencia a outra história.',
        ],
      },
    ],
  },
]);

export function getChronicle(slug: string) {
  return chronicles.find((item) => item.slug === slug) ?? null;
}

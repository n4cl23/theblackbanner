import {
  collectionCategorySchema,
  miniatureSchema,
  type CollectionCategory,
  type Miniature,
} from '@/features/collections/domain/miniature-schema';

export interface CollectionPresentation {
  slug: string;
  category: CollectionCategory;
  banner: string;
  identity: string;
  history: readonly string[];
  scales: readonly string[];
  videoStatus: 'prepared';
  printingNotes: readonly string[];
}
/** Provisional collection presentation; no text establishes official canon. */
export const collectionPresentations: readonly CollectionPresentation[] = [
  {
    slug: 'collection-vanguard',
    category: 'characters',
    banner: '/images/home/kingdoms-expanse.webp',
    identity: 'Estudos de silhueta e marcha para personagens da vanguarda.',
    history: [
      'Coleção mockada para validar composição, escala e relações editoriais.',
    ],
    scales: ['32 mm', '75 mm'],
    videoStatus: 'prepared',
    printingNotes: [
      'Inclinar peças longas entre 25° e 35°.',
      'Reforçar suportes em armas e estandartes.',
    ],
  },
  {
    slug: 'collection-beasts',
    category: 'creatures',
    banner: '/images/home/bestiary-ruins.webp',
    identity:
      'Criaturas observadas ao longo das estradas e pântanos de Asterheim.',
    history: ['Conjunto provisório de estudos do bestiário para impressão.'],
    scales: ['32 mm', '54 mm'],
    videoStatus: 'prepared',
    printingNotes: [
      'Usar suportes médios sob massas principais.',
      'Validar drenagem em volumes fechados.',
    ],
  },
] as const;

const rawMiniatures: Miniature[] = [
  {
    id: 'miniature-far-watcher',
    slug: 'far-watcher-32mm',
    title: 'The Far Watcher — Study',
    relatedEntity: { type: 'character', id: 'character-far-watcher' },
    collectionIds: ['collection-vanguard'],
    scale: '32 mm',
    dimensionsMm: { height: 38, width: 24, depth: 22 },
    pieceCount: 4,
    support: 'both',
    base: '25 mm scenic',
    suggestedMaterial: 'Resina standard de alta definição',
    resolutionMicrons: 50,
    orientation: 'Inclinação posterior de 30°',
    difficulty: 'intermediate',
    targetPrinter: 'MSLA 4K ou superior',
    includedFileDescriptors: [
      'Corpo dividido',
      'Arma',
      'Base cênica',
      'Versão sem suportes',
    ],
    version: '0.1.0',
    changelog: [
      { version: '0.1.0', note: 'Estrutura mock inicial.', date: '2026-07-18' },
    ],
    provenance: 'mock',
  },
  {
    id: 'miniature-banner-bearer',
    slug: 'banner-bearer-75mm',
    title: 'The Banner Bearer — Study',
    relatedEntity: { type: 'character', id: 'character-banner-bearer' },
    collectionIds: ['collection-vanguard'],
    scale: '75 mm',
    dimensionsMm: { height: 92, width: 48, depth: 42 },
    pieceCount: 7,
    support: 'presupported',
    base: '50 mm display',
    suggestedMaterial: 'Resina tough para detalhes longos',
    resolutionMicrons: 35,
    orientation: 'Estandarte separado a 25°',
    difficulty: 'advanced',
    targetPrinter: 'MSLA 8K de volume médio',
    includedFileDescriptors: [
      'Corpo',
      'Estandarte em três partes',
      'Lâmina',
      'Base',
    ],
    version: '0.1.0',
    changelog: [
      { version: '0.1.0', note: 'Estrutura mock inicial.', date: '2026-07-18' },
    ],
    provenance: 'mock',
  },
  {
    id: 'miniature-fog-stalker',
    slug: 'fog-stalker-54mm',
    title: 'The Fog Stalker — Field Study',
    relatedEntity: { type: 'creature', id: 'creature-fog-stalker' },
    collectionIds: ['collection-beasts'],
    scale: '54 mm',
    dimensionsMm: { height: 46, width: 82, depth: 58 },
    pieceCount: 5,
    support: 'both',
    base: '60 mm oval',
    suggestedMaterial: 'Resina abs-like',
    resolutionMicrons: 50,
    orientation: 'Corpo a 35°, membros separados',
    difficulty: 'intermediate',
    targetPrinter: 'MSLA 4K ou superior',
    includedFileDescriptors: ['Corpo', 'Membros', 'Base de névoa'],
    version: '0.1.0',
    changelog: [
      { version: '0.1.0', note: 'Estrutura mock inicial.', date: '2026-07-18' },
    ],
    provenance: 'mock',
  },
  {
    id: 'miniature-ash-hound',
    slug: 'ash-hound-32mm',
    title: 'The Ash Hound — Pack Study',
    relatedEntity: { type: 'creature', id: 'creature-ash-hound' },
    collectionIds: ['collection-beasts'],
    scale: '32 mm',
    dimensionsMm: { height: 31, width: 49, depth: 28 },
    pieceCount: 3,
    support: 'unsupported',
    base: '40 mm round',
    suggestedMaterial: 'Resina standard',
    resolutionMicrons: 50,
    orientation: 'Dorso a 30°',
    difficulty: 'beginner',
    targetPrinter: 'MSLA compacta',
    includedFileDescriptors: ['Corpo', 'Cauda alternativa', 'Base'],
    version: '0.1.0',
    changelog: [
      { version: '0.1.0', note: 'Estrutura mock inicial.', date: '2026-07-18' },
    ],
    provenance: 'mock',
  },
];
export const mockMiniatures = rawMiniatures.map((item) =>
  miniatureSchema.parse(item),
);
export const collectionCategories = collectionCategorySchema.options;
export function getCollectionPresentation(slug: string) {
  return collectionPresentations.find((item) => item.slug === slug) ?? null;
}
export function getMiniature(slug: string) {
  return mockMiniatures.find((item) => item.slug === slug) ?? null;
}

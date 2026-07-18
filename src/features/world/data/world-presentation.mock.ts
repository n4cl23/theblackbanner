export type KingdomVisualKey = 'ash' | 'iron' | 'veil';

export interface KingdomPresentation {
  slug: string;
  visual: KingdomVisualKey;
  numeral: string;
  landscape: string;
  climate: string;
  culture: string;
  threats: readonly string[];
  history: readonly string[];
  mapPath: string;
  mapLabel: { x: number; y: number };
}

/** Provisional presentation copy. It is not official Asterheim canon. */
export const kingdomPresentations: readonly KingdomPresentation[] = [
  {
    slug: 'kingdom-ashen-reach',
    visual: 'ash',
    numeral: 'I',
    landscape: '/images/home/asterheim-hero.webp',
    climate: 'Ar frio, cinzas suspensas e horizontes de baixa visibilidade.',
    culture: 'Vigílias itinerantes e memória preservada em marcos de pedra.',
    threats: [
      'Matilhas nas estradas',
      'Ruínas instáveis',
      'Fronteira contestada',
    ],
    history: ['O primeiro silêncio', 'A abertura da Estrada Negra'],
    mapPath: 'M70 92 L248 48 L335 112 L300 245 L154 277 L55 201 Z',
    mapLabel: { x: 170, y: 158 },
  },
  {
    slug: 'kingdom-iron-march',
    visual: 'iron',
    numeral: 'II',
    landscape: '/images/home/kingdoms-expanse.webp',
    climate: 'Tempestades persistentes sobre planícies de ferro e água.',
    culture: 'Juramentos de marcha, estandartes memoriais e fortalezas móveis.',
    threats: ['Predadores da névoa', 'Terras alagadas', 'Colossos errantes'],
    history: ['A queda do estandarte', 'A marcha sem retorno'],
    mapPath: 'M335 112 L520 65 L680 133 L648 271 L487 310 L300 245 Z',
    mapLabel: { x: 485, y: 177 },
  },
  {
    slug: 'kingdom-veiled-crown',
    visual: 'veil',
    numeral: 'III',
    landscape: '/images/home/bestiary-ruins.webp',
    climate: 'Névoa noturna, solo encharcado e bosques petrificados.',
    culture: 'Arquivos velados, cortes silenciosas e ritos de preservação.',
    threats: [
      'Vestígios sem nome',
      'Florestas mutáveis',
      'Relíquias sem guardião',
    ],
    history: ['O desaparecimento da coroa', 'O encontro dos ossos'],
    mapPath: 'M154 277 L300 245 L487 310 L590 420 L455 520 L226 486 L100 385 Z',
    mapLabel: { x: 330, y: 383 },
  },
] as const;

export function getKingdomPresentation(slug: string) {
  return kingdomPresentations.find((item) => item.slug === slug) ?? null;
}

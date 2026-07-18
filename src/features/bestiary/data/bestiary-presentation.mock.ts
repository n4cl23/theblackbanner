export type DocumentationStatus = 'fragmentary' | 'observed' | 'verified';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'singular';

export interface FieldEvidence {
  id: string;
  image: string;
  caption: string;
  category: string;
  origin: string;
  narrativeDate: string;
}
export interface CreaturePresentation {
  slug: string;
  category: string;
  size: string;
  behaviorType: string;
  rarity: Rarity;
  documentationStatus: DocumentationStatus;
  taxonomy: readonly string[];
  physical: string;
  behavior: string;
  diet: string;
  abilities: readonly string[];
  weaknesses: readonly string[];
  fieldReports: readonly string[];
  evidence: readonly FieldEvidence[];
}

const evidence = (
  slug: string,
  image: string,
  category: string,
): FieldEvidence[] => [
  {
    id: `${slug}-trace`,
    image,
    caption: 'Registro visual provisório de campo.',
    category,
    origin: 'Arquivo de observação mock',
    narrativeDate: 'Data não confirmada',
  },
  {
    id: `${slug}-habitat`,
    image: '/images/home/asterheim-hero.webp',
    caption: 'Estudo ambiental associado ao habitat.',
    category: 'Habitat',
    origin: 'Atlas provisório',
    narrativeDate: 'Após a queda de cinzas',
  },
];

/** Non-canonical bestiary presentation used only for validating the editorial experience. */
export const creaturePresentations: readonly CreaturePresentation[] = [
  {
    slug: 'creature-bone-below',
    category: 'Vestígio abissal',
    size: 'Colossal',
    behaviorType: 'Dormente',
    rarity: 'singular',
    documentationStatus: 'fragmentary',
    taxonomy: ['Vestigium', 'Subterranis', 'Ossaria'],
    physical:
      'Massa óssea percebida sob solo encharcado; limites anatômicos não confirmados.',
    behavior: 'Permanece imóvel por longos ciclos e altera o terreno ao redor.',
    diet: 'Desconhecida; nenhuma ingestão foi observada.',
    abilities: ['Deslocamento subterrâneo', 'Distorção do terreno'],
    weaknesses: ['Não documentadas'],
    fieldReports: [
      'O chão respirou antes de ceder.',
      'Nenhuma pegada deixou a clareira.',
    ],
    evidence: evidence(
      'bone-below',
      '/images/home/bestiary-ruins.webp',
      'Vestígio',
    ),
  },
  {
    slug: 'creature-fog-stalker',
    category: 'Predador territorial',
    size: 'Grande',
    behaviorType: 'Caçador',
    rarity: 'rare',
    documentationStatus: 'observed',
    taxonomy: ['Bestia', 'Nebularis', 'Venator'],
    physical:
      'Silhueta alongada, membros baixos e superfície que dispersa luz em névoa.',
    behavior:
      'Segue rotas laterais, evita fogo aberto e cerca viajantes isolados.',
    diet: 'Carne e resíduos minerais encontrados nas Marchas.',
    abilities: ['Ocultação em névoa', 'Rastreamento silencioso'],
    weaknesses: ['Luz contínua', 'Terreno seco'],
    fieldReports: [
      'A névoa moveu-se contra o vento.',
      'Três marcas cercavam apenas duas pegadas.',
    ],
    evidence: evidence(
      'fog-stalker',
      '/images/home/kingdoms-expanse.webp',
      'Avistamento',
    ),
  },
  {
    slug: 'creature-ash-hound',
    category: 'Caçador de matilha',
    size: 'Médio',
    behaviorType: 'Social',
    rarity: 'uncommon',
    documentationStatus: 'verified',
    taxonomy: ['Bestia', 'Cineris', 'Canidae'],
    physical:
      'Corpo compacto coberto por placas de cinza endurecida e fissuras de calor residual.',
    behavior:
      'Opera em matilhas, testa fronteiras e recua diante de formações defensivas.',
    diet: 'Carniça, couro e depósitos salinos.',
    abilities: ['Coordenação de matilha', 'Resistência a calor'],
    weaknesses: ['Água profunda', 'Ruído metálico intenso'],
    fieldReports: ['O primeiro uivo nunca veio do mais próximo.'],
    evidence: evidence(
      'ash-hound',
      '/images/home/asterheim-hero.webp',
      'Rastro',
    ),
  },
  {
    slug: 'creature-marsh-colossus',
    category: 'Entidade monumental',
    size: 'Colossal',
    behaviorType: 'Migratório',
    rarity: 'rare',
    documentationStatus: 'observed',
    taxonomy: ['Titanis', 'Palustris', 'Ferrum'],
    physical:
      'Estrutura vertical de pedra, raízes e placas ferrosas cobertas por água estagnada.',
    behavior:
      'Cruza as planícies durante tempestades e ignora estruturas menores.',
    diet: 'Absorção mineral presumida.',
    abilities: ['Travessia de pântano', 'Descarga atmosférica'],
    weaknesses: ['Movimento lento', 'Períodos de dormência'],
    fieldReports: ['A torre mudou de lugar durante a noite.'],
    evidence: evidence(
      'marsh-colossus',
      '/images/home/kingdoms-expanse.webp',
      'Escala',
    ),
  },
] as const;

export interface BiomePresentation {
  kingdomSlug: string;
  biome: string;
  atmosphere: string;
  image: string;
  riskZones: readonly string[];
  migrations: string;
  legends: string;
}
export const biomePresentations: readonly BiomePresentation[] = [
  {
    kingdomSlug: 'kingdom-ashen-reach',
    biome: 'Terras queimadas',
    atmosphere: 'Cinzas horizontais, pedra quente sob geada e ruínas expostas.',
    image: '/images/home/asterheim-hero.webp',
    riskZones: ['Campos de Cinza', 'Portão Negro'],
    migrations: 'Matilhas acompanham frentes de cinza em ciclos irregulares.',
    legends: 'Dizem que as brasas reconhecem nomes esquecidos.',
  },
  {
    kingdomSlug: 'kingdom-iron-march',
    biome: 'Tempestade e ferro',
    atmosphere: 'Planícies alagadas, magnetismo residual e relâmpagos baixos.',
    image: '/images/home/kingdoms-expanse.webp',
    riskZones: ['Marchas de Ferro', 'Estrada Afogada'],
    migrations:
      'Colossos atravessam a região quando a pressão atmosférica cai.',
    legends: 'Cada trovão seria um passo que ainda não alcançou o solo.',
  },
  {
    kingdomSlug: 'kingdom-veiled-crown',
    biome: 'Floresta ancestral e abismo',
    atmosphere: 'Bosques petrificados, névoa noturna e cavidades sem eco.',
    image: '/images/home/bestiary-ruins.webp',
    riskZones: ['Bosque Petrificado', 'Mata dos Ossos'],
    migrations: 'Não há padrão confirmado; rastros desaparecem sob as raízes.',
    legends: 'O bosque teria crescido para esconder aquilo que existe abaixo.',
  },
] as const;
export function getCreaturePresentation(slug: string) {
  return creaturePresentations.find((item) => item.slug === slug) ?? null;
}
export function getBiomePresentation(slug: string) {
  return biomePresentations.find((item) => item.kingdomSlug === slug) ?? null;
}

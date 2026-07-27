import type { Locale } from '@/config/i18n';
import { localizedPath } from '@/features/i18n/data/route-registry';

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
}

export interface NavigationGroup extends NavigationItem {
  readonly children?: readonly NavigationItem[];
}

const labels = {
  'pt-br': {
    home: 'Início',
    kingdoms: 'Reinos',
    map: 'Mapa',
    crowns: 'Coroas',
    guardians: 'Guardiões',
    characters: 'Personagens',
    all: 'Todos',
    bestiary: 'Bestiário',
    creatures: 'Criaturas',
    collections: 'Coleções',
    allCollections: 'Todas as Coleções',
    recentMiniatures: 'Miniaturas Recentes',
    chronicles: 'Crônicas',
    timeline: 'Timeline',
    gallery: 'Galeria',
    project: 'Projeto',
    about: 'Sobre',
    printing: 'Impressão 3D',
    printingGuide: 'Guia de Impressão',
  },
  en: {
    home: 'Home',
    kingdoms: 'Kingdoms',
    map: 'Map',
    crowns: 'Crowns',
    guardians: 'Guardians',
    characters: 'Characters',
    all: 'All',
    bestiary: 'Bestiary',
    creatures: 'Creatures',
    collections: 'Collections',
    allCollections: 'All Collections',
    recentMiniatures: 'Latest Miniatures',
    chronicles: 'Chronicles',
    timeline: 'Timeline',
    gallery: 'Gallery',
    project: 'Project',
    about: 'About',
    printing: '3D Printing',
    printingGuide: 'Printing Guide',
  },
  es: {
    home: 'Inicio',
    kingdoms: 'Reinos',
    map: 'Mapa',
    crowns: 'Coronas',
    guardians: 'Guardianes',
    characters: 'Personajes',
    all: 'Todos',
    bestiary: 'Bestiario',
    creatures: 'Criaturas',
    collections: 'Colecciones',
    allCollections: 'Todas las Colecciones',
    recentMiniatures: 'Miniaturas Recientes',
    chronicles: 'Crónicas',
    timeline: 'Cronología',
    gallery: 'Galería',
    project: 'Proyecto',
    about: 'Acerca de',
    printing: 'Impresión 3D',
    printingGuide: 'Guía de Impresión',
  },
} as const;

/** Single source of truth for the complete public navigation in every locale. */
export function getPublicNavigation(locale: Locale): readonly NavigationGroup[] {
  const t = labels[locale];
  const href = (path = '') => localizedPath(locale, path);
  return [
    { label: t.home, href: href() },
    {
      label: 'Asterheim',
      href: href('atlas'),
      children: [
        { label: t.kingdoms, href: href('atlas/reinos') },
        { label: 'Atlas', href: href('atlas') },
        { label: t.map, href: href('atlas/mapa') },
        { label: t.crowns, href: href('coroas') },
        { label: t.guardians, href: href('personagens') },
      ],
    },
    {
      label: t.characters,
      href: href('personagens'),
      children: [
        { label: t.all, href: href('personagens') },
        { label: t.guardians, href: href('personagens') },
      ],
    },
    {
      label: t.bestiary,
      href: href('bestiario'),
      children: [
        { label: 'Atlas', href: href('atlas') },
        { label: t.creatures, href: href('bestiario') },
      ],
    },
    {
      label: t.collections,
      href: href('colecoes'),
      children: [
        { label: t.allCollections, href: href('colecoes') },
        { label: t.recentMiniatures, href: href('miniaturas') },
        {
          label: 'Beasts of Asterheim',
          href: href('colecoes/beasts-of-asterheim'),
        },
        {
          label: 'Boss Collection',
          href: href('colecoes/boss-collection'),
        },
      ],
    },
    {
      label: t.chronicles,
      href: href('chronicles'),
      children: [
        { label: t.chronicles, href: href('chronicles') },
        { label: t.timeline, href: href('timeline') },
        { label: 'Lore', href: href('lore') },
      ],
    },
    {
      label: t.gallery,
      href: `${href()}#gallery`,
    },
    {
      label: t.project,
      href: `${href()}#editorial`,
      children: [
        { label: t.about, href: `${href()}#editorial` },
        { label: t.printing, href: `${href()}#editorial` },
        { label: 'Art Bible', href: '/design-system' },
        { label: t.printingGuide, href: '/guia-de-impressao' },
      ],
    },
  ];
}

export const publicNavigation = getPublicNavigation('pt-br');

export const publicNavigationLinks = publicNavigation.flatMap((group) => [
  { label: group.label, href: group.href },
  ...(group.children ?? []),
]);

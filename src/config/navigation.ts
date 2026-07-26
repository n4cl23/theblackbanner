export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
}

export interface NavigationGroup extends NavigationItem {
  readonly children?: readonly NavigationItem[];
}

/** Single source of truth. Every href resolves to an existing route or section. */
export const publicNavigation = [
  { label: 'Início', href: '/' },
  {
    label: 'Asterheim',
    href: '/world',
    children: [
      { label: 'Reinos', href: '/world/kingdoms' },
      { label: 'Atlas', href: '/pt-br/atlas' },
      { label: 'Mapa', href: '/world/map' },
      { label: 'Coroas', href: '/pt-br/coroas' },
      { label: 'Guardiões', href: '/guardioes' },
    ],
  },
  {
    label: 'Personagens',
    href: '/personagens',
    children: [
      { label: 'Todos', href: '/personagens' },
      { label: 'Guardiões', href: '/guardioes' },
    ],
  },
  {
    label: 'Bestiário',
    href: '/bestiario',
    children: [
      { label: 'Atlas', href: '/pt-br/atlas' },
      { label: 'Criaturas', href: '/bestiario' },
    ],
  },
  {
    label: 'Coleções',
    href: '/colecoes',
    children: [
      { label: 'Todas as Coleções', href: '/colecoes' },
      {
        label: 'Miniaturas Recentes',
        href: '/pt-br/miniaturas',
        description: 'Arquivo público de miniaturas e fichas técnicas.',
      },
      {
        label: 'Beasts of Asterheim',
        href: '/pt-br/colecoes/beasts-of-asterheim',
      },
      {
        label: 'Boss Collection',
        href: '/pt-br/colecoes/boss-collection',
      },
    ],
  },
  {
    label: 'Crônicas',
    href: '/chronicles',
    children: [
      { label: 'Crônicas', href: '/chronicles' },
      { label: 'Timeline', href: '/timeline' },
      { label: 'Lore', href: '/lore' },
    ],
  },
  {
    label: 'Galeria',
    href: '/#gallery',
    description: 'Galeria editorial disponível na Home.',
  },
  {
    label: 'Projeto',
    href: '/#editorial',
    children: [
      { label: 'Sobre', href: '/#editorial' },
      { label: 'Impressão 3D', href: '/guia-de-impressao' },
      { label: 'Art Bible', href: '/design-system' },
      { label: 'Guia de Impressão', href: '/guia-de-impressao' },
    ],
  },
] as const satisfies readonly NavigationGroup[];

export const publicNavigationLinks = publicNavigation.flatMap((group) => [
  { label: group.label, href: group.href },
  ...('children' in group ? group.children : []),
]);

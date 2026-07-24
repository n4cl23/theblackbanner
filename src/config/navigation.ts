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
      { label: 'Coroas', href: '/pt-br/coroas' },
      { label: 'Mapa', href: '/world/map' },
      { label: 'Timeline', href: '/timeline' },
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
      { label: 'Todas', href: '/colecoes' },
      {
        label: 'Miniaturas',
        href: '/pt-br/miniaturas',
        description: 'Arquivo público de miniaturas e fichas técnicas.',
      },
      { label: 'Guia', href: '/guia-de-impressao' },
    ],
  },
  {
    label: 'Crônicas',
    href: '/chronicles',
    children: [
      { label: 'Lore', href: '/lore' },
      { label: 'Histórias', href: '/chronicles' },
    ],
  },
  {
    label: 'Galeria',
    href: '/#gallery',
    description: 'Galeria editorial disponível na Home.',
  },
] as const satisfies readonly NavigationGroup[];

export const publicNavigationLinks = publicNavigation.flatMap((group) => [
  { label: group.label, href: group.href },
  ...('children' in group ? group.children : []),
]);

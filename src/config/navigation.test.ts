import { publicNavigation, publicNavigationLinks } from '@/config/navigation';

describe('public navigation contract', () => {
  it('keeps the expected hierarchy in one typed source', () => {
    expect(publicNavigation.map(({ label }) => label)).toEqual([
      'Início',
      'Asterheim',
      'Personagens',
      'Bestiário',
      'Coleções',
      'Crônicas',
      'Galeria',
    ]);
    expect(publicNavigationLinks.map(({ label }) => label)).toEqual(
      expect.arrayContaining([
        'Reinos',
        'Mapa',
        'Timeline',
        'Guardiões',
        'Atlas',
        'Criaturas',
        'Miniaturas',
        'Guia',
        'Lore',
        'Histórias',
      ]),
    );
  });

  it('contains no placeholder or empty destination', () => {
    for (const item of publicNavigationLinks) {
      expect(item.href).toMatch(/^\//);
      expect(item.href).not.toBe('#');
    }
  });

  it('publishes the localized miniature index in global navigation', () => {
    expect(publicNavigationLinks).toContainEqual(
      expect.objectContaining({
        label: 'Miniaturas',
        href: '/pt-br/miniaturas',
      }),
    );
  });
});

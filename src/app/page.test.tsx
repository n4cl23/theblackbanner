import { fireEvent, render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('cinematic Home', () => {
  it('renders every requested section', async () => {
    render(await HomePage());

    const headings = [
      'The Black Banner',
      'Seis domínios. Um destino.',
      'Exércitos, tavernas e lendas',
      'Latest Miniatures',
      'Aqueles que carregam as Coroas',
      'O que desperta sob a pedra',
      'Atravesse Asterheim',
      'Ecos através das eras',
      'Do códice para a mesa',
    ];

    for (const heading of headings) {
      expect(
        screen.getByRole('heading', { name: heading }),
      ).toBeInTheDocument();
    }
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('provides functional primary and secondary calls to action', async () => {
    render(await HomePage());
    expect(
      screen.getByRole('link', { name: 'Explore Asterheim' }),
    ).toHaveAttribute('href', '#asterheim');
    expect(
      screen.getByRole('link', { name: 'Ver miniaturas' }),
    ).toHaveAttribute('href', '/pt-br/miniaturas');
  });

  it('shows an accessible fallback when critical media fails', async () => {
    render(await HomePage());
    const hero = screen.getByRole('img', {
      name: 'Aster, o coração do mundo de Asterheim, diante de uma paisagem monumental',
    });
    fireEvent.error(hero);
    expect(
      screen.getByRole('img', {
        name: 'Aster, o coração do mundo de Asterheim, diante de uma paisagem monumental',
      }),
    ).toHaveTextContent('A paisagem de Asterheim não pôde ser carregada');
  });

  it('embeds the complete Home structured-data graph', async () => {
    const { container } = render(await HomePage());
    const schemas = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(schemas).toHaveLength(1);
    expect(schemas[0]).toHaveTextContent('WebSite');
    expect(schemas[0]).toHaveTextContent('CreativeWork');
    expect(schemas[0]).toHaveTextContent('Organization');
    expect(schemas[0]).toHaveTextContent('ImageObject');
  });
});

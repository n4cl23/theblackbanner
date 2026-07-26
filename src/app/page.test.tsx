import { fireEvent, render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('cinematic Home', () => {
  it('renders every requested section', async () => {
    render(await HomePage());

    const headings = [
      'The Black Banner',
      'O ambiente guarda a primeira memória',
      'Reinos separados pela mesma guerra',
      'Personagens em destaque',
      'Há coisas antigas sob as ruínas',
      'Coleções moldadas pela narrativa',
      'Ecos através das eras',
      'Galeria de atmosferas',
      'Toda guerra deixa um registro. Nem todo registro diz a verdade.',
      'Receba sinais além da muralha',
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
      screen.getByRole('link', { name: 'Entrar em Asterheim' }),
    ).toHaveAttribute('href', '#asterheim');
    expect(
      screen.getByRole('link', { name: 'Explorar coleções' }),
    ).toHaveAttribute('href', '#collections');
  });

  it('shows an accessible fallback when critical media fails', async () => {
    render(await HomePage());
    const hero = screen.getByRole('img', {
      name: 'Uma fortaleza monumental de Asterheim além de um vale coberto por cinzas',
    });
    fireEvent.error(hero);
    expect(
      screen.getByRole('img', {
        name: 'Uma fortaleza monumental de Asterheim além de um vale coberto por cinzas',
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

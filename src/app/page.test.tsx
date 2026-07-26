import { fireEvent, render } from '@testing-library/react';

import HomePage from '@/app/page';

describe('cinematic Home', () => {
  it('renders every requested section', async () => {
    const { container } = render(await HomePage());

    const headings = [
      'Seis domínios. Um destino.',
      'Exércitos, tavernas e lendas',
      'Latest Miniatures',
      'Aqueles que carregam as Coroas',
      'O que desperta sob a pedra',
      'Atravesse Asterheim',
      'Ecos através das eras',
      'Do códice para a mesa',
    ];

    expect(container.querySelector('h1')).toHaveTextContent(
      /The Black\s*Banner/,
    );
    const renderedHeadings = [...container.querySelectorAll('h1, h2')].map(
      (heading) => heading.textContent?.replace(/\s+/g, ' ').trim(),
    );
    expect(renderedHeadings).toEqual(expect.arrayContaining(headings));
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('provides functional primary and secondary calls to action', async () => {
    const { container } = render(await HomePage());
    expect(
      container.querySelector('a[href="#asterheim"]'),
    ).toHaveTextContent('Explore Asterheim');
    expect(
      container.querySelector('main a[href="/pt-br/miniaturas"]'),
    ).toHaveTextContent('Ver miniaturas');
  });

  it('shows an accessible fallback when critical media fails', async () => {
    const { container } = render(await HomePage());
    const hero = container.querySelector(
      'img[alt="Aster, o coração do mundo de Asterheim, diante de uma paisagem monumental"]',
    );
    expect(hero).not.toBeNull();
    if (!hero) throw new Error('Hero image not rendered');
    fireEvent.error(hero);
    expect(
      container.querySelector(
        '[role="img"][aria-label="Aster, o coração do mundo de Asterheim, diante de uma paisagem monumental"]',
      ),
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

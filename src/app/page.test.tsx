import { fireEvent, render } from '@testing-library/react';

import { LocalizedHomePage } from '@/app/page';

describe('cinematic Home', () => {
  it('renders every requested section', async () => {
    const { container } = render(
      await LocalizedHomePage({ locale: 'pt-br' }),
    );

    const headings = [
      'Seis domínios. Um destino.',
      'Exércitos, tavernas e lendas',
      'Latest Miniatures',
      'King Aldric',
      'Construindo Asterheim',
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

  it('provides one focused primary call to action', async () => {
    const { container } = render(
      await LocalizedHomePage({ locale: 'pt-br' }),
    );
    expect(
      container.querySelector(
        'section[aria-labelledby="home-hero-title"] a[href="#asterheim"]',
      ),
    ).toHaveTextContent('Explore Asterheim');
    expect(
      container.querySelector(
        'section[aria-labelledby="home-hero-title"] a[href="/pt-br/miniaturas"]',
      ),
    ).not.toBeInTheDocument();
  });

  it('shows an accessible fallback when critical media fails', async () => {
    const { container } = render(
      await LocalizedHomePage({ locale: 'pt-br' }),
    );
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
    const { container } = render(
      await LocalizedHomePage({ locale: 'pt-br' }),
    );
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

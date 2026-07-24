import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import sitemap from '@/app/sitemap';
import LocalizedPage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/[locale]/[[...path]]/page';
import { LanguageSwitcher } from '@/features/i18n/components/language-switcher';
import { localizedDocuments } from '@/features/i18n/data/localized-content.mock';
import {
  localizedHref,
  resolveRoute,
} from '@/features/i18n/data/route-registry';
import { localizedDocumentSchema } from '@/features/i18n/domain/localized-content-schema';
const push = vi.fn();
vi.mock('next/navigation', async () => ({
  ...(await vi.importActual('next/navigation')),
  useRouter: () => ({ push }),
  notFound: () => {
    throw new Error('not-found');
  },
}));
describe('real internationalization', () => {
  it('maps translated slugs to one semantic route', () => {
    expect(resolveRoute(['linha-do-tempo'])).toBe('timeline');
    expect(resolveRoute(['timeline'])).toBe('timeline');
    expect(resolveRoute(['cronologia'])).toBe('timeline');
    expect(localizedHref('es', 'roadsArticle')).toBe(
      '/es/lore/caminos-y-ruinas',
    );
  });
  it('preserves the semantic page when switching languages', () => {
    render(<LanguageSwitcher locale="pt-br" routeKey="roadsArticle" />);
    fireEvent.change(screen.getByLabelText('Language'), {
      target: { value: 'en' },
    });
    expect(push).toHaveBeenCalledWith('/en/lore/roads-and-ruins');
  });
  it('renders translated interface and content for each locale', async () => {
    const english = await LocalizedPage({
      params: Promise.resolve({
        locale: 'en',
        path: ['lore', 'roads-and-ruins'],
      }),
    });
    const { unmount } = render(english);
    expect(
      screen.getByRole('heading', { name: 'Roads and Ruins' }),
    ).toBeVisible();
    expect(screen.getByText(/roads of Asterheim connect/i)).toBeVisible();
    unmount();
    const portuguese = await LocalizedPage({
      params: Promise.resolve({
        locale: 'pt-br',
        path: ['lore', 'estradas-e-ruinas'],
      }),
    });
    render(portuguese);
    expect(
      screen.getByText(/estradas de Asterheim não conectam/i),
    ).toBeVisible();
  });
  it('never falls back silently when editorial translation is missing', async () => {
    const spanish = await LocalizedPage({
      params: Promise.resolve({
        locale: 'es',
        path: ['lore', 'caminos-y-ruinas'],
      }),
    });
    render(spanish);
    expect(
      screen.getByRole('heading', {
        name: 'Contenido no disponible en este idioma',
      }),
    ).toBeVisible();
    expect(
      screen.queryByText(/estradas de Asterheim/i),
    ).not.toBeInTheDocument();
  });
  it('creates localized canonical, hreflang, x-default, and Open Graph metadata', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en', path: ['timeline'] }),
    });
    expect(metadata.alternates).toMatchObject({
      canonical: '/en/timeline',
      languages: {
        'pt-BR': '/pt-br/linha-do-tempo',
        en: '/en/timeline',
        es: '/es/cronologia',
        'x-default': '/pt-br/linha-do-tempo',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      locale: 'en',
      url: '/en/timeline',
    });
  });
  it('generates locale sitemap entries and static routes', () => {
    expect(sitemap()).toHaveLength(40);
    expect(sitemap().some((entry) => entry.url.endsWith('/pt-br/atlas'))).toBe(
      true,
    );
    expect(
      sitemap().find((entry) => entry.url.endsWith('/es/cronologia'))
        ?.alternates?.languages,
    ).toHaveProperty('x-default');
    expect(generateStaticParams()).toHaveLength(30);
  });
  it('models CMS locale status, original, linked translation, incompleteness, and preview', () => {
    localizedDocuments.forEach((document) =>
      expect(localizedDocumentSchema.safeParse(document).success).toBe(true),
    );
    const article = localizedDocuments[0]!;
    expect(article.originalLocale).toBe('pt-br');
    expect(article.variants.find((item) => item.locale === 'en')).toMatchObject(
      {
        status: 'draft',
        translationOf: 'article-roads-and-ruins',
        incomplete: true,
      },
    );
    expect(article.previewableLocales).toEqual(['pt-br', 'en', 'es']);
  });
});

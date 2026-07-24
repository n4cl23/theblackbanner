import type { MetadataRoute } from 'next';
import { getPublicEnvironment } from '@/config/env';
import { siteConfig } from '@/config/site';
import {
  localizedRoutes,
  localizedHref,
  type RouteKey,
} from '@/features/i18n/data/route-registry';
import { crowns } from '@/content/heroic-entities';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicEnvironment().appUrl ?? siteConfig.url;
  const localized = (Object.keys(localizedRoutes) as RouteKey[]).flatMap(
    (key) =>
      (['pt-br', 'en', 'es'] as const).map((locale) => ({
        url: new URL(localizedHref(locale, key), base).toString(),
        lastModified: new Date('2026-07-18'),
        changeFrequency:
          key === 'home' ? ('weekly' as const) : ('monthly' as const),
        priority: key === 'home' ? 1 : 0.7,
        alternates: {
          languages: {
            'pt-BR': new URL(localizedHref('pt-br', key), base).toString(),
            en: new URL(localizedHref('en', key), base).toString(),
            es: new URL(localizedHref('es', key), base).toString(),
            'x-default': new URL(localizedHref('pt-br', key), base).toString(),
          },
        },
      })),
  );
  const atlasPaths = [
    '/pt-br/atlas',
    '/pt-br/atlas/mapa',
    '/pt-br/atlas/reinos',
    '/pt-br/atlas/criaturas',
    '/pt-br/atlas/regioes/region-ashen-reach',
    '/pt-br/atlas/regioes/region-iron-march',
    '/pt-br/atlas/regioes/region-veiled-crown',
  ];
  return [
    ...localized,
    ...atlasPaths.map((path) => ({
      url: new URL(path, base).toString(),
      lastModified: new Date('2026-07-23'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: new URL('/pt-br/coroas', base).toString(),
      lastModified: new Date('2026-07-24'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...crowns.map((crown) => ({
      url: new URL(`/pt-br/coroas/${crown.slug}`, base).toString(),
      lastModified: new Date('2026-07-24'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

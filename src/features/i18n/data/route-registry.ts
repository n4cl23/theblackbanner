import { i18nConfig } from '@/config/i18n';
import type { Locale } from '@/features/i18n/domain/localized-content-schema';

export const localizedRoutes = {
  home: { 'pt-br': '', en: '', es: '' },
  lore: { 'pt-br': 'lore', en: 'lore', es: 'lore' },
  timeline: { 'pt-br': 'linha-do-tempo', en: 'timeline', es: 'cronologia' },
  chronicles: { 'pt-br': 'cronicas', en: 'chronicles', es: 'cronicas' },
  roadsArticle: {
    'pt-br': 'lore/estradas-e-ruinas',
    en: 'lore/roads-and-ruins',
    es: 'lore/caminos-y-ruinas',
  },
  blackRoad: {
    'pt-br': 'cronicas/a-estrada-negra',
    en: 'chronicles/the-black-road',
    es: 'cronicas/el-camino-negro',
  },
  characters: { 'pt-br': 'personagens', en: 'characters', es: 'personajes' },
  bestiary: { 'pt-br': 'bestiario', en: 'bestiary', es: 'bestiario' },
  collections: { 'pt-br': 'colecoes', en: 'collections', es: 'colecciones' },
  world: { 'pt-br': 'mundo', en: 'world', es: 'mundo' },
} as const satisfies Record<string, Record<Locale, string>>;
export type RouteKey = keyof typeof localizedRoutes;
export function localizedHref(locale: Locale, key: RouteKey) {
  const path = localizedRoutes[key][locale];
  return `/${locale}${path ? `/${path}` : ''}`;
}

export function localizedPath(locale: Locale, path = '') {
  const normalized = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`;
  return `/${locale}${normalized}`;
}

export function localizePathname(pathname: string, nextLocale: Locale) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalized.split('/');
  if (i18nConfig.locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale;
    return segments.join('/') || `/${nextLocale}`;
  }
  return localizedPath(nextLocale, normalized);
}
export function resolveRoute(path: readonly string[]): RouteKey | null {
  const joined = path.join('/');
  for (const [key, routes] of Object.entries(localizedRoutes) as [
    RouteKey,
    Record<Locale, string>,
  ][])
    if (Object.values(routes).includes(joined)) return key;
  return null;
}
export function localizedAlternates(key: RouteKey) {
  return {
    languages: {
      'pt-BR': localizedHref('pt-br', key),
      en: localizedHref('en', key),
      es: localizedHref('es', key),
      'x-default': localizedHref(i18nConfig.defaultLocale, key),
    },
  };
}
export const staticLocaleParams = Object.entries(localizedRoutes).flatMap(
  ([key, paths]) =>
    i18nConfig.locales.map((locale) => ({
      locale,
      path: paths[locale] ? paths[locale].split('/') : undefined,
      key: key as RouteKey,
    })),
);

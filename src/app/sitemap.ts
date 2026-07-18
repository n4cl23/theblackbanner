import type { MetadataRoute } from 'next';
import { getPublicEnvironment } from '@/config/env';
import {
  localizedRoutes,
  localizedHref,
  type RouteKey,
} from '@/features/i18n/data/route-registry';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicEnvironment().appUrl ?? 'http://localhost:3000';
  return (Object.keys(localizedRoutes) as RouteKey[]).flatMap((key) =>
    (['pt-br', 'en', 'es'] as const).map((locale) => ({
      url: new URL(localizedHref(locale, key), base).toString(),
      lastModified: new Date('2026-07-18'),
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
}

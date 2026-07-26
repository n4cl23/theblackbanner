import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import type { Locale } from '@/features/i18n/domain/localized-content-schema';
import type { RouteKey } from '@/features/i18n/data/route-registry';

export function LocalizedShell({
  locale,
  children,
}: {
  locale: Locale;
  routeKey: RouteKey;
  children: ReactNode;
}) {
  return (
    <div lang={locale === 'pt-br' ? 'pt-BR' : locale}>
      <SiteHeader locale={locale} position="sticky" />
      {children}
      <SiteFooter locale={locale} />
    </div>
  );
}

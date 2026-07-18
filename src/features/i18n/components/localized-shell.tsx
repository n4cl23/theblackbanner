import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/features/i18n/domain/localized-content-schema';
import { getDictionary } from '@/features/i18n/data/translations';
import { LanguageSwitcher } from './language-switcher';
import {
  localizedHref,
  type RouteKey,
} from '@/features/i18n/data/route-registry';
export function LocalizedShell({
  locale,
  routeKey,
  children,
}: {
  locale: Locale;
  routeKey: RouteKey;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  return (
    <div lang={locale === 'pt-br' ? 'pt-BR' : locale}>
      <header className="border-b border-stone-600/25">
        <div className="mx-auto flex min-h-16 max-w-[90rem] items-center gap-5 px-5">
          <Link
            className="font-display mr-auto text-xl uppercase"
            href={localizedHref(locale, 'home')}
          >
            The Black Banner
          </Link>
          <nav
            aria-label={
              locale === 'en'
                ? 'Main navigation'
                : locale === 'es'
                  ? 'Navegación principal'
                  : 'Navegação principal'
            }
          >
            <ul className="hidden gap-5 text-xs uppercase sm:flex">
              <li>
                <Link href={localizedHref(locale, 'lore')}>{t.navLore}</Link>
              </li>
              <li>
                <Link href={localizedHref(locale, 'timeline')}>
                  {t.navTimeline}
                </Link>
              </li>
              <li>
                <Link href={localizedHref(locale, 'chronicles')}>
                  {t.navChronicles}
                </Link>
              </li>
            </ul>
          </nav>
          <LanguageSwitcher locale={locale} routeKey={routeKey} />
        </div>
      </header>
      {children}
    </div>
  );
}

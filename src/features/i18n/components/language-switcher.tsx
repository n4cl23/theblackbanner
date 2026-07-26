'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

import { i18nConfig, type Locale } from '@/config/i18n';
import { localizePathname } from '@/features/i18n/data/route-registry';

const languageNames: Record<Locale, string> = {
  'pt-br': 'PT — Português',
  en: 'EN — English',
  es: 'ES — Español',
};

const switcherLabels: Record<Locale, string> = {
  'pt-br': 'Selecionar idioma',
  en: 'Select language',
  es: 'Seleccionar idioma',
};

export function LanguageSwitcher({
  locale,
  compact = false,
  onNavigate,
}: {
  locale: Locale;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();

  function switchLocale(
    event: MouseEvent<HTMLAnchorElement>,
    nextLocale: Locale,
  ) {
    event.preventDefault();
    const target = `${localizePathname(pathname, nextLocale)}${window.location.search}${window.location.hash}`;
    onNavigate?.();
    router.push(target);
  }

  return (
    <nav aria-label={switcherLabels[locale]}>
      <ul className="flex items-center gap-1">
        {i18nConfig.locales.map((item) => (
          <li key={item}>
            <Link
              aria-current={item === locale ? 'page' : undefined}
              className={
                item === locale
                  ? 'text-aged-gold-500'
                  : 'text-parchment-200/55 hover:text-ivory-100'
              }
              href={localizePathname(pathname, item)}
              hrefLang={item}
              lang={item}
              onClick={(event) => switchLocale(event, item)}
            >
              {compact ? item.replace('-br', '').toUpperCase() : languageNames[item]}
              <span className="sr-only">
                {item === locale ? ` — ${switcherLabels[locale]}` : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

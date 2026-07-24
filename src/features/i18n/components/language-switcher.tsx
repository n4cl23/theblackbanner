'use client';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/features/i18n/domain/localized-content-schema';
import { dictionaries } from '@/features/i18n/data/translations';
import {
  localizedHref,
  type RouteKey,
} from '@/features/i18n/data/route-registry';
export function LanguageSwitcher({
  locale,
  routeKey,
}: {
  locale: Locale;
  routeKey: RouteKey;
}) {
  const router = useRouter();
  return (
    <label>
      <span className="sr-only">
        {locale === 'pt-br'
          ? 'Selecionar idioma'
          : locale === 'es'
            ? 'Seleccionar idioma'
            : 'Select language'}
      </span>
      <select
        aria-label="Language"
        className="bg-coal-950 min-h-11 border border-stone-600/40 px-3 text-xs uppercase"
        onChange={(event) =>
          router.push(localizedHref(event.target.value as Locale, routeKey))
        }
        value={locale}
      >
        {(Object.keys(dictionaries) as Locale[]).map((item) => (
          <option key={item} value={item}>
            {dictionaries[item].language}
          </option>
        ))}
      </select>
    </label>
  );
}

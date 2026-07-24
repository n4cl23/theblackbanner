import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomePage from '@/app/page';
import { i18nConfig } from '@/config/i18n';
import { LocalizedShell } from '@/features/i18n/components/localized-shell';
import { getLocalizedVariant } from '@/features/i18n/data/localized-content.mock';
import {
  localizedAlternates,
  localizedHref,
  resolveRoute,
  staticLocaleParams,
  type RouteKey,
} from '@/features/i18n/data/route-registry';
import { getDictionary } from '@/features/i18n/data/translations';
import {
  localeSchema,
  type Locale,
} from '@/features/i18n/domain/localized-content-schema';

type Props = { params: Promise<{ locale: string; path?: string[] }> };
const routeTitles: Record<RouteKey, Record<Locale, string>> = {
  home: {
    'pt-br': 'The Black Banner — Crônicas de Asterheim',
    en: 'The Black Banner — Chronicles of Asterheim',
    es: 'The Black Banner — Crónicas de Asterheim',
  },
  lore: {
    'pt-br': 'Lore conectado',
    en: 'Connected Lore',
    es: 'Lore conectado',
  },
  timeline: { 'pt-br': 'Linha do tempo', en: 'Timeline', es: 'Cronología' },
  chronicles: { 'pt-br': 'Crônicas', en: 'Chronicles', es: 'Crónicas' },
  roadsArticle: {
    'pt-br': 'Estradas e ruínas',
    en: 'Roads and Ruins',
    es: 'Caminos y ruinas',
  },
  blackRoad: {
    'pt-br': 'A Estrada Negra',
    en: 'The Black Road',
    es: 'El Camino Negro',
  },
  characters: { 'pt-br': 'Personagens', en: 'Characters', es: 'Personajes' },
  bestiary: { 'pt-br': 'Bestiário', en: 'Bestiary', es: 'Bestiario' },
  collections: { 'pt-br': 'Coleções', en: 'Collections', es: 'Colecciones' },
  world: { 'pt-br': 'Mundo', en: 'World', es: 'Mundo' },
};
export function generateStaticParams() {
  return staticLocaleParams.map(({ locale, path }) =>
    path ? { locale, path } : { locale },
  );
}
function context(rawLocale: string, path: readonly string[] = []) {
  const parsed = localeSchema.safeParse(rawLocale);
  if (!parsed.success) return null;
  const routeKey = resolveRoute(path);
  return routeKey ? { locale: parsed.data, routeKey } : null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, path } = await params;
  const value = context(rawLocale, path);
  if (!value) return { title: 'Not found', robots: { index: false } };
  const { locale, routeKey } = value;
  const title = routeTitles[routeKey][locale];
  const href = localizedHref(locale, routeKey);
  return {
    title,
    description: getDictionary(locale).heroBody,
    alternates: { canonical: href, ...localizedAlternates(routeKey) },
    openGraph: {
      title,
      description: getDictionary(locale).heroBody,
      url: href,
      locale: locale === 'pt-br' ? 'pt_BR' : locale,
      alternateLocale: i18nConfig.locales
        .filter((item) => item !== locale)
        .map((item) => (item === 'pt-br' ? 'pt_BR' : item)),
    },
  };
}
export default async function LocalizedPage({ params }: Props) {
  const { locale: rawLocale, path } = await params;
  const value = context(rawLocale, path);
  if (!value) notFound();
  const { locale, routeKey } = value;
  return (
    <LocalizedShell locale={locale} routeKey={routeKey}>
      {renderRoute(locale, routeKey)}
    </LocalizedShell>
  );
}

function renderRoute(locale: Locale, routeKey: RouteKey) {
  const t = getDictionary(locale);
  if (routeKey === 'home' && locale === 'pt-br') return <HomePage />;
  if (routeKey === 'home')
    return (
      <main>
        <section className="relative flex min-h-[82vh] items-end overflow-hidden px-5 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(118,83,45,.22),transparent_35%),linear-gradient(120deg,#080909,#171613)]" />
          <div className="relative mx-auto w-full max-w-[90rem]">
            <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
              {t.heroEyebrow}
            </p>
            <h1 className="font-display mt-6 max-w-5xl text-[clamp(4rem,11vw,9rem)] leading-[.82] uppercase">
              {t.heroTitle}
            </h1>
            <p className="text-parchment-200/65 mt-8 max-w-2xl text-lg">
              {t.heroBody}
            </p>
            <Link
              className="border-aged-gold-500/50 mt-9 inline-flex min-h-12 items-center border px-6 uppercase"
              href={localizedHref(locale, 'lore')}
            >
              {t.heroCta}
            </Link>
          </div>
        </section>
      </main>
    );
  if (routeKey === 'roadsArticle')
    return (
      <LocalizedArticle locale={locale} documentId="localized-roads-article" />
    );
  if (routeKey === 'blackRoad')
    return (
      <LocalizedArticle locale={locale} documentId="localized-black-road" />
    );
  if (routeKey === 'lore')
    return (
      <Archive
        locale={locale}
        title={routeTitles.lore[locale]}
        eyebrow={t.interfaceReady}
        items={[
          {
            title: routeTitles.roadsArticle[locale],
            href: localizedHref(locale, 'roadsArticle'),
          },
        ]}
      />
    );
  if (routeKey === 'chronicles')
    return (
      <Archive
        locale={locale}
        title={routeTitles.chronicles[locale]}
        eyebrow={t.interfaceReady}
        items={[
          {
            title: routeTitles.blackRoad[locale],
            href: localizedHref(locale, 'blackRoad'),
          },
        ]}
      />
    );
  if (routeKey === 'timeline') return <LocalizedTimeline locale={locale} />;
  return (
    <Archive
      locale={locale}
      title={routeTitles[routeKey][locale]}
      eyebrow={t.interfaceReady}
      items={[]}
    />
  );
}
function Archive({
  locale,
  title,
  eyebrow,
  items,
}: {
  locale: Locale;
  title: string;
  eyebrow: string;
  items: readonly { title: string; href: string }[];
}) {
  const t = getDictionary(locale);
  return (
    <main className="mx-auto min-h-[75vh] max-w-[90rem] px-5 py-20">
      <p className="text-aged-gold-500 text-xs uppercase">{eyebrow}</p>
      <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] uppercase">
        {title}
      </h1>
      {items.length ? (
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <Link
              className="border border-stone-600/30 p-8 text-3xl"
              href={item.href}
              key={item.href}
            >
              {item.title}
              <span className="mt-4 block text-sm uppercase">{t.readMore}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-parchment-200/60 mt-12 max-w-xl">
          {t.unavailableBody}
        </p>
      )}
    </main>
  );
}
function LocalizedArticle({
  locale,
  documentId,
}: {
  locale: Locale;
  documentId: string;
}) {
  const t = getDictionary(locale);
  const variant = getLocalizedVariant(documentId, locale);
  if (!variant || variant.status === 'unavailable')
    return (
      <main className="mx-auto min-h-[75vh] max-w-4xl px-5 py-24">
        <p className="text-aged-gold-500 text-xs uppercase">
          {t.interfaceReady}
        </p>
        <h1 className="font-display mt-6 text-6xl uppercase">
          {t.unavailable}
        </h1>
        <p className="text-parchment-200/60 mt-7 text-lg">
          {t.unavailableBody}
        </p>
      </main>
    );
  const date = new Intl.DateTimeFormat(locale === 'pt-br' ? 'pt-BR' : locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date('2026-07-18'));
  return (
    <main className="mx-auto min-h-[75vh] max-w-[52rem] px-5 py-24">
      <p className="text-aged-gold-500 text-xs uppercase">
        {variant.status !== 'published' ? t.draft : t.interfaceReady} · {date}
      </p>
      <h1 className="font-display mt-6 text-[clamp(4rem,9vw,7rem)] uppercase">
        {variant.title}
      </h1>
      {variant.body.map((paragraph) => (
        <p className="mt-9 text-xl leading-9" key={paragraph}>
          {paragraph}
        </p>
      ))}
      {variant.incomplete ? (
        <aside className="border-aged-gold-500 mt-12 border-l px-5">
          {t.draft}
        </aside>
      ) : null}
    </main>
  );
}
function LocalizedTimeline({ locale }: { locale: Locale }) {
  const labels = {
    'pt-br': [
      'O Primeiro Silêncio',
      'A Estrada Negra se abre',
      'A queda do estandarte',
    ],
    en: ['The First Silence', 'The Black Road Opens', 'The Banner Falls'],
    es: [
      'El Primer Silencio',
      'Se abre el Camino Negro',
      'La caída del estandarte',
    ],
  }[locale];
  const formatter = new Intl.NumberFormat(
    locale === 'pt-br' ? 'pt-BR' : locale,
  );
  return (
    <main className="mx-auto min-h-[75vh] max-w-[90rem] px-5 py-20">
      <p className="text-aged-gold-500 text-xs uppercase">
        {getDictionary(locale).interfaceReady}
      </p>
      <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] uppercase">
        {routeTitles.timeline[locale]}
      </h1>
      <ol className="border-aged-gold-500/40 mt-14 border-l pl-8">
        {labels.map((label, index) => (
          <li className="mb-10" key={label}>
            <p className="text-xs uppercase">
              {locale === 'en' ? 'Year' : locale === 'es' ? 'Año' : 'Ano'}{' '}
              {formatter.format((index + 1) * 34)}
            </p>
            <h2 className="font-display mt-2 text-4xl uppercase">{label}</h2>
          </li>
        ))}
      </ol>
    </main>
  );
}

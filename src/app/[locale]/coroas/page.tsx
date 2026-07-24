import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/shared/json-ld';
import { crowns } from '@/content/heroic-entities';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Coroas de Asterheim',
  description: 'As seis Coroas canônicas e seus Guardiões.',
  alternates: {
    canonical: '/pt-br/coroas',
    languages: {
      'pt-BR': '/pt-br/coroas',
      en: '/en/coroas',
      es: '/es/coroas',
      'x-default': '/pt-br/coroas',
    },
  },
};

export default async function CrownsPage({ params }: Props) {
  const { locale } = await params;
  if (!['pt-br', 'en', 'es'].includes(locale)) notFound();
  if (locale !== 'pt-br') return <Unavailable locale={locale} />;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Coroas de Asterheim',
    inLanguage: 'pt-BR',
    hasPart: crowns.map((crown) => ({
      '@type': 'CreativeWork',
      name: crown.title,
      url: `/pt-br/coroas/${crown.slug}`,
    })),
  };

  return (
    <main className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
      <JsonLd data={collectionJsonLd} />
      <header className="max-w-5xl py-16">
        <p className="text-aged-gold-500 text-xs tracking-[.4em] uppercase">
          Seis forças · seis legados
        </p>
        <h1 className="font-display mt-5 text-[clamp(4rem,12vw,9rem)] uppercase">
          Coroas de Asterheim
        </h1>
        <p className="text-parchment-200/65 mt-7 max-w-2xl text-lg">
          As Coroas retornam ao arquivo editorial através dos registros
          aprovados do Atlas.
        </p>
      </header>
      <ol className="grid gap-5 md:grid-cols-2">
        {crowns.map((crown, index) => (
          <li
            className="border-stone-700 min-h-80 border p-8"
            key={crown.id}
          >
            <Link
              className="flex h-full flex-col justify-between"
              href={`/${locale}/coroas/${crown.slug}`}
            >
              <span className="text-aged-gold-500 font-display text-5xl opacity-50">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-xs tracking-widest uppercase">
                  Força · {crown.force}
                </p>
                <h2 className="font-display mt-3 text-4xl uppercase">
                  {crown.title}
                </h2>
                <p className="text-parchment-200/60 mt-4">
                  {crown.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}

function Unavailable({ locale }: { locale: string }) {
  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-5 py-24">
      <h1 className="font-display text-5xl uppercase">
        {locale === 'en'
          ? 'Crowns unavailable in this language'
          : 'Coronas no disponibles en este idioma'}
      </h1>
      <p className="text-parchment-200/60 mt-6">
        {locale === 'en'
          ? 'The canonical translation has not been approved.'
          : 'La traducción canónica aún no fue aprobada.'}
      </p>
    </main>
  );
}

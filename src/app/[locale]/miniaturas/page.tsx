import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { MiniatureExplorer } from '@/features/collections/components/miniature-explorer';
import {
  getFeaturedMiniatures,
  getMiniatureFilters,
  getMiniatures,
} from '@/features/collections/data/miniature-repository';

type Props = { params: Promise<{ locale: string }> };
export const metadata: Metadata = {
  title: 'Miniaturas de Asterheim',
  description:
    'Arquivo público de estudos técnicos de miniaturas de Asterheim.',
  alternates: { canonical: '/pt-br/miniaturas' },
};

export default async function LocalizedMiniaturesPage({ params }: Props) {
  const { locale } = await params;
  if (!['pt-br', 'en', 'es'].includes(locale)) notFound();
  if (locale !== 'pt-br') return <Unavailable locale={locale} />;
  const [records, filters, featured] = await Promise.all([
    getMiniatures(locale),
    getMiniatureFilters(locale),
    getFeaturedMiniatures(locale),
  ]);
  const lead = featured[0] ?? records[0];
  return (
    <>
      <SiteHeader position="sticky" />
      <main>
        <section className="relative isolate min-h-[72vh] overflow-hidden">
          <Image
            alt={lead?.banner.alt ?? 'Arquivo de miniaturas de Asterheim'}
            className="-z-20 object-cover opacity-45"
            fill
            priority
            sizes="100vw"
            src={lead?.banner.src ?? '/images/home/asterheim-hero.webp'}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="mx-auto flex min-h-[72vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-xs uppercase">
              <Link href={`/${locale}`}>Início</Link> / Miniaturas
            </nav>
            <p className="text-aged-gold-500 mt-16 text-xs tracking-[.3em] uppercase">
              Arquivo de formas · dados mock publicados
            </p>
            <h1 className="font-display mt-5 max-w-5xl text-[clamp(4rem,10vw,8rem)] leading-[.84] uppercase">
              Miniaturas de Asterheim
            </h1>
            <p className="text-parchment-200/65 mt-7 max-w-2xl text-lg">
              Estudos técnicos conectados aos arquivos narrativos. Nenhum STL
              privado é exposto nesta superfície.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8">
          <Suspense fallback={<p role="status">Organizando miniaturas…</p>}>
            <MiniatureExplorer
              filters={filters}
              locale={locale}
              records={records}
            />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Unavailable({ locale }: { locale: string }) {
  return (
    <>
      <SiteHeader position="sticky" />
      <main className="mx-auto min-h-[70vh] max-w-4xl px-5 py-24">
        <h1 className="font-display text-5xl uppercase">
          {locale === 'en'
            ? 'Miniatures unavailable in this language'
            : 'Miniaturas no disponibles en este idioma'}
        </h1>
        <p className="text-parchment-200/60 mt-6">
          {locale === 'en'
            ? 'The editorial translation has not been approved. Portuguese content is not shown silently.'
            : 'La traducción editorial aún no fue aprobada. El contenido en portugués no se muestra silenciosamente.'}
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

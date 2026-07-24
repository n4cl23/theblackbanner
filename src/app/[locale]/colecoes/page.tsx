import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getPublishedCollections } from '@/features/collections/data/miniature-repository';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: 'Coleções de Asterheim',
  description: 'Coleções editoriais e miniaturas de Asterheim.',
  alternates: { canonical: '/pt-br/colecoes' },
};

export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params;
  if (!['pt-br', 'en', 'es'].includes(locale)) notFound();
  if (locale !== 'pt-br') return <Unavailable locale={locale} />;
  const collections = await getPublishedCollections(locale);
  return (
    <>
      <SiteHeader position="sticky" />
      <main
        className="entity-archive mx-auto min-h-[70vh] max-w-[90rem] px-5 py-16 sm:px-8"
        id="main-content"
      >
        <header className="cinematic-page-header max-w-5xl py-14">
          <p className="text-aged-gold-500 text-xs tracking-[.35em] uppercase">
            Arquivo de formas
          </p>
          <h1 className="font-display mt-5 text-[clamp(4rem,10vw,8rem)] leading-[.85] uppercase">
            Coleções de Asterheim
          </h1>
          <p className="text-parchment-200/60 mt-8 max-w-2xl text-lg">
            O acervo real foi inventariado. Coleções incompletas permanecem em
            revisão e não são promovidas automaticamente.
          </p>
        </header>
        {collections.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {collections.map((collection) => (
              <Link
                className="border border-stone-600/30 p-8"
                href={`/${locale}/colecoes/${collection.slug}`}
                key={collection.id}
              >
                <h2 className="font-display text-4xl uppercase">
                  {collection.title}
                </h2>
                <p className="text-parchment-200/60 mt-4">
                  {collection.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <section
            aria-live="polite"
            className="border-stone-700 border-y py-12"
          >
            <h2 className="font-display text-3xl uppercase">
              Nenhuma coleção publicada
            </h2>
            <p className="text-parchment-200/70 mt-4 max-w-2xl">
              Treze coleções reais foram mapeadas como rascunho e aguardam
              aprovação editorial.
            </p>
          </section>
        )}
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
            ? 'Collections unavailable in this language'
            : 'Colecciones no disponibles en este idioma'}
        </h1>
      </main>
      <SiteFooter />
    </>
  );
}

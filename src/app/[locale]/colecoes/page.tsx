import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import {
  getMiniatures,
  getPublishedCollections,
} from '@/features/collections/data/miniature-repository';

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
  const [collections, miniatures] = await Promise.all([
    getPublishedCollections(locale),
    getMiniatures(locale),
  ]);
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
            Companhias, tavernas, lendas e criaturas reunidas em arquivos
            visuais conectados ao universo de Asterheim.
          </p>
        </header>
        {collections.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {collections.map((collection) => (
              <Link
                className="codex-card group relative min-h-[30rem] overflow-hidden"
                href={`/${locale}/colecoes/${collection.slug}`}
                key={collection.id}
              >
                {collection.cover ? (
                  <Image
                    alt={collection.cover.alt}
                    className="object-cover opacity-60 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-75"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src={collection.cover.src}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/20" />
                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                  <p className="text-aged-gold-500 text-xs tracking-[.2em] uppercase">
                    {
                      miniatures.filter(
                        (item) => item.collectionSlug === collection.slug,
                      ).length
                    }{' '}
                    miniaturas
                  </p>
                  <h2 className="font-display mt-3 text-4xl uppercase">
                    {collection.title}
                  </h2>
                  {collection.description ? (
                    <p className="text-parchment-200/70 mt-4 line-clamp-3">
                      {collection.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <section
            aria-live="polite"
            className="border-y border-stone-700 py-12"
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

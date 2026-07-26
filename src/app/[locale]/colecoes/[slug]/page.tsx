import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getCollectionPageData } from '@/features/collections/data/collection-repository';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getCollectionPageData(slug, locale);
  if (!data) {
    return { title: 'Coleção indisponível', robots: { index: false } };
  }
  return {
    title: data.collection.title,
    description: data.collection.description ?? undefined,
    alternates: { canonical: `/${locale}/colecoes/${slug}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params;
  const data = await getCollectionPageData(slug, locale);
  if (!data) notFound();
  const { collection, miniatures } = data;
  if (!collection.cover) notFound();
  const collectionCover = collection.cover;

  return (
    <>
      <SiteHeader position="sticky" />
      <main>
        <section className="relative min-h-[72vh] overflow-hidden">
          <Image
            alt={collectionCover.alt}
            className="object-cover opacity-55"
            fill
            priority
            sizes="100vw"
            src={collectionCover.src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          <div className="relative mx-auto flex min-h-[72vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-xs uppercase">
              <Link href={`/${locale}/colecoes`}>Coleções</Link> /{' '}
              {collection.title}
            </nav>
            <h1 className="font-display mt-16 max-w-5xl text-[clamp(4rem,10vw,8rem)] leading-[.84] uppercase">
              {collection.title}
            </h1>
            {collection.description ? (
              <p className="text-parchment-200/70 mt-7 max-w-2xl text-xl">
                {collection.description}
              </p>
            ) : null}
          </div>
        </section>
        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8">
          <h2 className="font-display text-4xl uppercase">Miniaturas</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {miniatures.map((miniature) => (
              <Link
                className="codex-card miniature-card group overflow-hidden"
                href={`/${locale}/miniaturas/${miniature.slug}`}
                key={miniature.id}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    alt={miniature.cover?.alt ?? miniature.title}
                    className="object-cover opacity-75 transition duration-500 group-hover:scale-[1.03]"
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    src={miniature.cover?.src ?? collectionCover.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-3xl uppercase">
                      {miniature.title}
                    </h3>
                    {miniature.status === 'catalogued' ? (
                      <p className="text-aged-gold-500 mt-3 text-xs uppercase">
                        Em desenvolvimento
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

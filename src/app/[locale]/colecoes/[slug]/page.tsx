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
  if (!collection.cover || !collection.description) notFound();

  return (
    <>
      <SiteHeader position="sticky" />
      <main>
        <section className="relative min-h-[72vh] overflow-hidden">
          <Image
            alt={collection.cover.alt}
            className="object-cover opacity-55"
            fill
            priority
            sizes="100vw"
            src={collection.cover.src}
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
            <p className="text-parchment-200/70 mt-7 max-w-2xl text-xl">
              {collection.description}
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8">
          <h2 className="font-display text-4xl uppercase">Miniaturas</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {miniatures.map((miniature) => (
              <Link
                className="codex-card miniature-card min-h-40 p-7"
                href={`/${locale}/miniaturas/${miniature.slug}`}
                key={miniature.id}
              >
                <h3 className="font-display text-3xl">{miniature.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

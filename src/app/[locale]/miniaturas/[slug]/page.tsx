import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isRemovedDemoSlug } from '@/content/removed-demo-content';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLd } from '@/components/shared/json-ld';
import { absoluteUrl } from '@/config/site';
import { LockedDownload } from '@/features/collections/components/locked-download';
import {
  getMiniatureBySlug,
  getMiniaturesByCollection,
} from '@/features/collections/data/miniature-repository';

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (isRemovedDemoSlug(slug)) notFound();
  const item = await getMiniatureBySlug(slug, locale);
  if (!item)
    return { title: 'Miniatura indisponível', robots: { index: false } };
  return {
    title: item.seo.title,
    description: item.seo.description,
    alternates: { canonical: `/${locale}/miniaturas/${slug}` },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      images: [
        {
          url: item.cover.src,
          width: item.cover.width,
          height: item.cover.height,
          alt: item.cover.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.excerpt,
      images: [item.cover.src],
    },
  };
}
export default async function LocalizedMiniaturePage({ params }: Props) {
  const { locale, slug } = await params;
  const item = await getMiniatureBySlug(slug, locale);
  if (!item) notFound();
  const related = (
    await getMiniaturesByCollection(item.collectionSlug, locale)
  ).filter((record) => record.id !== item.id);
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: item.title,
      description: item.description,
      image: absoluteUrl(item.cover.src),
      inLanguage: 'pt-BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Miniaturas',
          item: absoluteUrl(`/${locale}/miniaturas`),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: item.title,
          item: absoluteUrl(`/${locale}/miniaturas/${slug}`),
        },
      ],
    },
  ];
  return (
    <>
      <SiteHeader position="sticky" />
      <main>
        <JsonLd data={schemas} />
        <section className="relative min-h-[78vh] overflow-hidden">
          <Image
            alt={item.banner.alt}
            className="object-cover opacity-55"
            fill
            priority
            sizes="100vw"
            src={item.banner.src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          <div className="relative mx-auto flex min-h-[78vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-xs uppercase">
              <Link href={`/${locale}/miniaturas`}>Miniaturas</Link> /{' '}
              {item.title}
            </nav>
            <p className="text-aged-gold-500 mt-16 text-xs uppercase">
              {item.entityType} · {item.scale} · {item.availability}
            </p>
            <h1 className="font-display mt-5 max-w-5xl text-[clamp(3.5rem,9vw,7rem)] leading-[.85] uppercase">
              {item.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl">{item.subtitle}</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="font-display text-4xl uppercase">
              Identidade e fabricação
            </h2>
            <p className="text-parchment-200/65 mt-6 text-lg leading-relaxed">
              {item.description}
            </p>
            <dl className="mt-10 grid gap-px bg-stone-600/25 sm:grid-cols-2">
              <Spec
                label="Dimensões"
                value={`${item.dimensionsMm.height} × ${item.dimensionsMm.width} × ${item.dimensionsMm.depth} mm`}
              />
              <Spec label="Peças" value={String(item.pieceCount)} />
              <Spec label="Base" value={item.base} />
              <Spec
                label="Pré-suporte"
                value={
                  item.presupported
                    ? 'Disponível no registro'
                    : 'Não documentado'
                }
              />
              <Spec label="Dificuldade" value={item.printDifficulty} />
              <Spec label="Material" value={item.recommendedMaterial} />
              <Spec label="Impressora" value={item.targetPrinter} />
              <Spec label="Modelo 3D" value="Nenhum GLB válido fornecido" />
            </dl>
          </div>
          <LockedDownload
            descriptors={item.includedFileDescriptors}
            version={item.version}
          />
        </section>
        <section className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8">
          <h2 className="font-display text-4xl uppercase">Relações</h2>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              className="border border-stone-600/40 p-5"
              href={`/colecoes/${item.collectionSlug}`}
            >
              Coleção: {item.collectionSlug}
            </Link>
            <Link
              className="border border-stone-600/40 p-5"
              href={`/${item.entityType === 'creature' ? 'bestiario' : 'personagens'}/${item.entitySlug}`}
            >
              Entidade: {item.entitySlug}
            </Link>
            <Link
              className="border border-stone-600/40 p-5"
              href={item.printGuide}
            >
              Guia de impressão
            </Link>
            {related.map((record) => (
              <Link
                className="border border-stone-600/40 p-5"
                href={`/${locale}/miniaturas/${record.slug}`}
                key={record.id}
              >
                {record.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-coal-950 min-h-28 p-5">
      <dt className="text-aged-gold-500 text-xs uppercase">{label}</dt>
      <dd className="mt-3">{value}</dd>
    </div>
  );
}

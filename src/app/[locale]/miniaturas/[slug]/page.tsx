import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLd } from '@/components/shared/json-ld';
import { absoluteUrl } from '@/config/site';
import { getMiniaturePageData } from '@/features/collections/data/collection-repository';
import { getMiniatures } from '@/features/collections/data/miniature-repository';
import { publishedMiniatureSlugs } from '@/features/collections/data/published-miniature-slugs';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const miniatures = await getMiniatures('pt-br');
  const resolvedSlugs = new Set(miniatures.map(({ slug }) => slug));
  if (
    publishedMiniatureSlugs.some((slug) => !resolvedSlugs.has(slug)) ||
    resolvedSlugs.size !== publishedMiniatureSlugs.length
  ) {
    throw new Error('Published miniature routes differ from the approved batch');
  }
  return miniatures.map(({ slug }) => ({ locale: 'pt-br', slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getMiniaturePageData(slug, locale);
  if (!data) {
    return { title: 'Miniatura indisponível', robots: { index: false } };
  }
  return {
    title: `${data.miniature.title} — Miniatura`,
    description: data.miniature.description ?? 'Miniatura de Asterheim.',
    alternates: { canonical: `/${locale}/miniaturas/${slug}` },
    openGraph: data.miniature.cover
      ? {
          images: [
            {
              url: data.miniature.cover.src,
              width: data.miniature.cover.width,
              height: data.miniature.cover.height,
              alt: data.miniature.cover.alt,
            },
          ],
        }
      : undefined,
  };
}

export default async function LocalizedMiniaturePage({ params }: Props) {
  const { locale, slug } = await params;
  const data = await getMiniaturePageData(slug, locale);
  if (!data) notFound();
  const { miniature, collection } = data;
  if (!miniature.cover || !miniature.description) notFound();
  const dimensions = miniature.dimensionsMm
    ? [
        miniature.dimensionsMm.height,
        miniature.dimensionsMm.width,
        miniature.dimensionsMm.depth,
      ].every((value) => value !== null)
      ? `${miniature.dimensionsMm.height} × ${miniature.dimensionsMm.width} × ${miniature.dimensionsMm.depth} mm`
      : null
    : null;
  const specifications = [
    dimensions ? { label: 'Dimensões', value: dimensions } : null,
    miniature.scale ? { label: 'Escala', value: miniature.scale } : null,
    miniature.pieceCount
      ? { label: 'Peças', value: String(miniature.pieceCount) }
      : null,
    miniature.base ? { label: 'Base', value: miniature.base } : null,
    miniature.support ? { label: 'Suporte', value: miniature.support } : null,
    miniature.difficulty
      ? { label: 'Dificuldade', value: miniature.difficulty }
      : null,
    miniature.material
      ? { label: 'Material', value: miniature.material }
      : null,
  ].filter((entry): entry is { label: string; value: string } =>
    Boolean(entry),
  );

  return (
    <>
      <SiteHeader position="sticky" />
      <main>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: miniature.title,
            description: miniature.description,
            image: absoluteUrl(miniature.cover.src),
            inLanguage: 'pt-BR',
          }}
        />
        <section className="relative min-h-[78vh] overflow-hidden">
          <Image
            alt={miniature.cover.alt}
            className="object-cover opacity-55"
            fill
            priority
            sizes="100vw"
            src={miniature.cover.src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          <div className="relative mx-auto flex min-h-[78vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8">
            <nav aria-label="Breadcrumb" className="text-xs uppercase">
              <Link href={`/${locale}/miniaturas`}>Miniaturas</Link> /{' '}
              {miniature.title}
            </nav>
            <p className="text-aged-gold-500 mt-16 text-xs uppercase">
              {miniature.entityType}
              {miniature.scale ? ` · ${miniature.scale}` : ''}
            </p>
            <h1 className="font-display mt-5 max-w-5xl text-[clamp(3.5rem,9vw,7rem)] leading-[.85] uppercase">
              {miniature.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl">
              {collection?.title ?? miniature.collectionTitle}
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8">
          <div>
            <h2 className="font-display text-4xl uppercase">Identidade</h2>
            <p className="text-parchment-200/65 mt-6 text-lg leading-relaxed">
              {miniature.description}
            </p>
            {specifications.length ? (
              <dl className="mt-10 grid gap-px bg-stone-600/25 sm:grid-cols-2">
                {specifications.map((specification) => (
                  <Spec key={specification.label} {...specification} />
                ))}
              </dl>
            ) : null}
          </div>
        </section>
        {miniature.gallery.length > 1 ? (
          <section
            aria-labelledby="miniature-gallery"
            className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8"
          >
            <h2
              className="font-display text-4xl uppercase"
              id="miniature-gallery"
            >
              Galeria
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {miniature.gallery.map((asset) => (
                <figure
                  className="relative aspect-[4/3] overflow-hidden"
                  key={asset.src}
                >
                  <Image
                    alt={asset.alt}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    src={asset.src}
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}
        {miniature.video ? (
          <section
            aria-labelledby="miniature-video"
            className="mx-auto max-w-[90rem] px-5 pb-20 sm:px-8"
          >
            <h2
              className="font-display text-4xl uppercase"
              id="miniature-video"
            >
              Registro em movimento
            </h2>
            <video
              className="mt-8 aspect-video w-full bg-black object-cover"
              controls
              playsInline
              poster={miniature.video.poster ?? undefined}
              preload="metadata"
            >
              <source src={miniature.video.src} />
            </video>
          </section>
        ) : null}
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

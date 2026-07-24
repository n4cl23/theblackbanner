import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLd } from '@/components/shared/json-ld';
import { absoluteUrl } from '@/config/site';
import { LockedDownload } from '@/features/collections/components/locked-download';
import { getMiniaturePageData } from '@/features/collections/data/collection-repository';

type Props = { params: Promise<{ locale: string; slug: string }> };

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
              {miniature.entityType} ·{' '}
              {miniature.scale ?? 'escala não documentada'}
            </p>
            <h1 className="font-display mt-5 max-w-5xl text-[clamp(3.5rem,9vw,7rem)] leading-[.85] uppercase">
              {miniature.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl">
              {collection?.title ?? miniature.collectionTitle}
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="font-display text-4xl uppercase">
              Identidade e fabricação
            </h2>
            <p className="text-parchment-200/65 mt-6 text-lg leading-relaxed">
              {miniature.description}
            </p>
            <dl className="mt-10 grid gap-px bg-stone-600/25 sm:grid-cols-2">
              <Spec
                label="Dimensões"
                value={
                  miniature.dimensionsMm
                    ? `${miniature.dimensionsMm.height ?? '—'} × ${miniature.dimensionsMm.width ?? '—'} × ${miniature.dimensionsMm.depth ?? '—'} mm`
                    : 'Não documentado'
                }
              />
              <Spec
                label="Peças"
                value={
                  miniature.pieceCount
                    ? String(miniature.pieceCount)
                    : 'Não documentado'
                }
              />
              <Spec label="Base" value={miniature.base ?? 'Não documentado'} />
              <Spec
                label="Suporte"
                value={miniature.support ?? 'Não documentado'}
              />
              <Spec
                label="Dificuldade"
                value={miniature.difficulty ?? 'Não documentado'}
              />
              <Spec
                label="Material"
                value={miniature.material ?? 'Não documentado'}
              />
              <Spec
                label="Modelo 3D"
                value={
                  miniature.model3d
                    ? 'Disponível'
                    : 'Nenhum GLB público aprovado'
                }
              />
            </dl>
          </div>
          <LockedDownload descriptors={[]} version="não publicada" />
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

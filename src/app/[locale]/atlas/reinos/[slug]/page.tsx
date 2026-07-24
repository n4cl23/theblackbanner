import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAtlasKingdomBySlug,
  getAtlasRegions,
  getAtlasCreatures,
} from '@/features/atlas/data/atlas-repository';
import { isRemovedDemoSlug } from '@/content/removed-demo-content';
export async function generateStaticParams() {
  const regions = await getAtlasRegions();
  return regions
    .filter((region) => !isRemovedDemoSlug(region.kingdomSlug))
    .map((r) => ({ locale: 'pt-br', slug: r.kingdomSlug }))
    .filter((v, i, a) => a.findIndex((x) => x.slug === v.slug) === i);
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const k = await getAtlasKingdomBySlug(slug);
  return k
    ? {
        title: `Atlas — ${k.title}`,
        description: k.excerpt,
        alternates: { canonical: `/pt-br/atlas/reinos/${slug}` },
      }
    : { title: 'Reino não encontrado', robots: { index: false } };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== 'pt-br' || isRemovedDemoSlug(slug)) notFound();
  const [k, regions, creatures] = await Promise.all([
    getAtlasKingdomBySlug(slug),
    getAtlasRegions(),
    getAtlasCreatures(),
  ]);
  if (!k) notFound();
  const local = regions.filter((r) => r.kingdomSlug === slug);
  return (
    <main className="mx-auto max-w-[80rem] px-5 py-20">
      <nav aria-label="Breadcrumb">
        <Link href={`/${locale}/atlas`}>Atlas</Link> / Reinos / {k.title}
      </nav>
      <h1 className="font-display mt-10 text-7xl uppercase">
        {k.sigil} {k.title}
      </h1>
      <p className="mt-7 max-w-3xl text-xl">{k.description}</p>
      <h2 className="font-display mt-16 text-4xl uppercase">
        Regiões e espécies
      </h2>
      {local.map((r) => (
        <article className="mt-6 border border-stone-600/30 p-7" key={r.id}>
          <Link
            href={`/${locale}/atlas/regioes/${r.slug}`}
            className="text-3xl"
          >
            {r.title}
          </Link>
          <p>{r.climate}</p>
          <p>
            {creatures
              .filter((c) => c.regionIds.includes(r.id))
              .map((c) => c.title)
              .join(' · ') || 'Nenhuma espécie documentada'}
          </p>
        </article>
      ))}
    </main>
  );
}

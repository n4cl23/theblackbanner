import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAtlasRegionBySlug,
  getAtlasCreatures,
  getAtlasPointsOfInterest,
  getAtlasRegions,
} from '@/features/atlas/data/atlas-repository';
export async function generateStaticParams() {
  return (await getAtlasRegions()).map((r) => ({
    locale: 'pt-br',
    slug: r.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = await getAtlasRegionBySlug(slug);
  return r
    ? {
        title: r.title,
        description: r.description,
        alternates: { canonical: `/pt-br/atlas/regioes/${slug}` },
        openGraph: {
          title: r.title,
          description: r.description,
          images: [{ url: r.media }],
        },
      }
    : { title: 'Região não encontrada', robots: { index: false } };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (locale !== 'pt-br') notFound();
  const [r, creatures, places] = await Promise.all([
    getAtlasRegionBySlug(slug),
    getAtlasCreatures(),
    getAtlasPointsOfInterest(),
  ]);
  if (!r) notFound();
  return (
    <main>
      <section className="relative min-h-[55vh]">
        <Image
          alt={`Paisagem provisória de ${r.title}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
          src={r.media}
        />
        <div className="relative mx-auto flex min-h-[55vh] max-w-[80rem] flex-col justify-end px-5 py-14">
          <h1 className="font-display text-7xl uppercase">{r.title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[80rem] px-5 py-20">
        <dl className="grid gap-4 md:grid-cols-3">
          <Fact l="Clima" v={r.climate} />
          <Fact l="Bioma" v={r.biome.title} />
          <Fact l="Perigo" v={r.dangerLevel} />
        </dl>
        <h2 className="font-display mt-16 text-4xl uppercase">Criaturas</h2>
        {creatures
          .filter((c) => r.creatures.includes(c.slug))
          .map((c) => (
            <Link
              className="mt-4 block border border-stone-600/30 p-5"
              href={`/bestiario/${c.slug}`}
              key={c.id}
            >
              {c.title} →
            </Link>
          ))}
        <h2 className="font-display mt-16 text-4xl uppercase">
          Pontos de interesse
        </h2>
        {places
          .filter((p) => r.locations.includes(p.slug))
          .map((p) => (
            <p className="border-aged-gold-500 mt-4 border-l pl-5" key={p.id}>
              {p.title}
            </p>
          ))}
      </section>
    </main>
  );
}
function Fact({ l, v }: { l: string; v: string }) {
  return (
    <div className="border border-stone-600/30 p-6">
      <dt>{l}</dt>
      <dd className="mt-3 text-xl">{v}</dd>
    </div>
  );
}

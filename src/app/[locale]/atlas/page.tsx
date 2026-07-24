import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WorldMap } from '@/features/world/components/world-map';
import { getKingdomPresentation } from '@/features/world/data/world-presentation.mock';
import {
  getAtlasCreatures,
  getAtlasKingdoms,
  getAtlasPointsOfInterest,
  getAtlasRegions,
} from '@/features/atlas/data/atlas-repository';
export const metadata: Metadata = {
  title: 'Atlas de Asterheim',
  description: 'Códice geográfico e bestiário provisório de Asterheim.',
  alternates: { canonical: '/pt-br/atlas' },
};
export default async function AtlasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'pt-br') notFound();
  const [kingdoms, regions, creatures, locations] = await Promise.all([
    getAtlasKingdoms(),
    getAtlasRegions(),
    getAtlasCreatures(),
    getAtlasPointsOfInterest(),
  ]);
  const mapKingdoms = kingdoms.map((k) => ({
    ...getKingdomPresentation(k.slug)!,
    title: k.title,
    sigil: k.sigil,
  }));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Atlas de Asterheim',
    url: `/${locale}/atlas`,
    numberOfItems: regions.length,
  };
  return (
    <main>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c'),
        }}
        type="application/ld+json"
      />
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          alt="Paisagem provisória de Asterheim"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
          src="/images/home/asterheim-hero.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-[90rem] flex-col justify-end px-5 py-16">
          <p className="text-aged-gold-500 text-xs uppercase">
            Códice cartográfico · dados provisórios
          </p>
          <h1 className="font-display mt-5 text-[clamp(4rem,11vw,9rem)] uppercase">
            Atlas de Asterheim
          </h1>
          <p className="mt-5 max-w-2xl text-xl">
            Explore territórios, espécies e vestígios conectados aos arquivos
            existentes.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[90rem] px-5 py-20">
        <h2 className="font-display mb-10 text-5xl uppercase">
          Mapa principal
        </h2>
        <WorldMap kingdoms={mapKingdoms} />
      </section>
      <section className="mx-auto grid max-w-[90rem] gap-5 px-5 pb-24 md:grid-cols-3">
        {regions.map((r) => (
          <Link
            className="relative min-h-72 overflow-hidden border border-stone-600/30 p-7"
            href={`/${locale}/atlas/regioes/${r.slug}`}
            key={r.id}
          >
            <Image
              alt=""
              fill
              sizes="33vw"
              className="-z-10 object-cover opacity-25"
              src={r.media}
            />
            <p className="text-aged-gold-500 text-xs uppercase">
              {r.biome.title} · risco {r.dangerLevel}
            </p>
            <h2 className="font-display mt-4 text-4xl uppercase">{r.title}</h2>
            <p className="mt-4">{r.climate}</p>
          </Link>
        ))}
      </section>
      <section className="mx-auto max-w-[90rem] px-5 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Reinos" value={kingdoms.length} />
          <Stat label="Criaturas vinculadas" value={creatures.length} />
          <Stat label="Pontos de interesse" value={locations.length} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/atlas/mapa`}>Abrir mapa dedicado →</Link>
          <Link href={`/${locale}/atlas/criaturas`}>Criaturas do Atlas →</Link>
          <Link href="/timeline">Timeline →</Link>
        </div>
      </section>
    </main>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-stone-600/30 p-7">
      <p className="text-xs uppercase">{label}</p>
      <strong className="font-display mt-3 block text-5xl">{value}</strong>
    </div>
  );
}

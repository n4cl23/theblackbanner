import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentRepository } from '@/features/content/repository/repository';
import { getAtlasPageData } from '@/features/bestiary/data/bestiary-repository';
import { getCreaturePresentation } from '@/features/bestiary/data/bestiary-presentation.mock';
import { isRemovedDemoSlug } from '@/content/removed-demo-content';
type Props = { params: Promise<{ kingdom: string }> };
export async function generateStaticParams() {
  return (await (await getContentRepository()).getKingdoms())
    .filter(({ slug }) => !isRemovedDemoSlug(slug))
    .map(({ slug }) => ({ kingdom: slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kingdom } = await params;
  const data = await getAtlasPageData(kingdom);
  if (!data) return { title: 'Bioma não encontrado', robots: { index: false } };
  return {
    title: `Atlas — ${data.kingdom.title}`,
    description: data.biome?.atmosphere ?? data.kingdom.excerpt,
    alternates: { canonical: `/atlas/${kingdom}` },
    openGraph: {
      title: `Atlas de ${data.kingdom.title}`,
      description: data.kingdom.excerpt,
      images: data.biome ? [{ url: data.biome.image }] : [],
    },
  };
}
export default async function KingdomAtlasPage({ params }: Props) {
  const { kingdom } = await params;
  if (isRemovedDemoSlug(kingdom)) notFound();
  const data = await getAtlasPageData(kingdom);
  if (!data || !data.biome) notFound();
  const { biome, regions, creatures } = data;
  const dominant = creatures.toSorted((a, b) =>
    b.threatLevel.localeCompare(a.threatLevel),
  )[0];
  return (
    <main>
      <section className="relative grid min-h-[80vh] place-items-end overflow-hidden">
        <Image
          alt={`Atmosfera provisória de ${biome.biome}`}
          className="object-cover opacity-60"
          fill
          priority
          sizes="100vw"
          src={biome.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/40" />
        <div className="relative mx-auto w-full max-w-[90rem] px-5 py-16 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="text-parchment-200/50 text-xs uppercase"
          >
            <Link href="/atlas">Atlas</Link> / {data.kingdom.title}
          </nav>
          <p className="text-aged-gold-500 mt-16 text-xs tracking-[.3em] uppercase">
            Bioma territorial · mock
          </p>
          <h1 className="font-display mt-5 max-w-5xl text-[clamp(4rem,10vw,8rem)] leading-[.84] uppercase">
            {biome.biome}
          </h1>
          <p className="text-parchment-200/70 mt-7 max-w-2xl text-xl">
            {biome.atmosphere}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
        <div className="grid gap-px bg-stone-600/25 md:grid-cols-2 xl:grid-cols-3">
          <AtlasFact
            title="Biomas"
            value={regions
              .map((item) => `${item.title}: ${item.climate}`)
              .join(' · ')}
          />
          <AtlasFact
            title="Espécie dominante"
            value={dominant?.title ?? 'Não documentada'}
          />
          <AtlasFact
            title="Zonas de risco"
            value={biome.riskZones.join(' · ')}
          />
          <AtlasFact
            title="Endêmicas"
            value={
              creatures.map((item) => item.title).join(' · ') ||
              'Nenhuma confirmada'
            }
          />
          <AtlasFact title="Migrações" value={biome.migrations} />
          <AtlasFact title="Lendas" value={biome.legends} />
        </div>
      </section>
      <section className="border-t border-stone-600/25">
        <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8">
          <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
            Distribuição observada
          </p>
          <h2 className="font-display mt-4 text-5xl uppercase">
            Espécies deste reino
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {creatures.map((creature) => {
              const presentation = getCreaturePresentation(creature.slug);
              return (
                <Link
                  className="relative min-h-72 overflow-hidden border border-stone-600/30 p-7"
                  href={`/bestiario/${creature.slug}`}
                  key={creature.id}
                >
                  {presentation?.evidence[0] ? (
                    <Image
                      alt=""
                      className="object-cover opacity-25"
                      fill
                      sizes="50vw"
                      src={presentation.evidence[0].image}
                    />
                  ) : null}
                  <div className="relative">
                    <p className="text-aged-gold-500 text-xs uppercase">
                      {presentation?.rarity} · {creature.threatLevel}
                    </p>
                    <h3 className="font-display mt-4 text-3xl">
                      {creature.title}
                    </h3>
                    <p className="text-parchment-200/50 mt-3">
                      {presentation?.behaviorType}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
function AtlasFact({ title, value }: { title: string; value: string }) {
  return (
    <article className="bg-coal-950 min-h-52 p-8">
      <h2 className="text-aged-gold-500 text-xs tracking-widest uppercase">
        {title}
      </h2>
      <p className="font-display mt-5 text-2xl leading-relaxed">{value}</p>
    </article>
  );
}

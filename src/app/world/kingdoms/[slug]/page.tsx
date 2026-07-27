import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentRepository } from '@/features/content/repository/repository';
import { KingdomSigil } from '@/components/shared/asterheim';
import { getKingdomPageData } from '@/features/world/data/world-repository';
import { isRemovedDemoSlug } from '@/content/removed-demo-content';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const kingdoms = await (await getContentRepository()).getKingdoms();
  return kingdoms
    .filter(({ slug }) => !isRemovedDemoSlug(slug))
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getKingdomPageData(slug);
  if (!data) return { title: 'Reino não encontrado', robots: { index: false } };
  return {
    title: data.kingdom.title,
    description: data.kingdom.seo.description,
    alternates: { canonical: `/world/kingdoms/${slug}` },
    openGraph: {
      title: data.kingdom.title,
      description: data.kingdom.excerpt,
      type: 'article',
      images: data.presentation ? [{ url: data.presentation.landscape }] : [],
    },
  };
}

export default async function KingdomPage({ params }: Props) {
  const { slug } = await params;
  if (isRemovedDemoSlug(slug)) notFound();
  const data = await getKingdomPageData(slug);
  if (!data || !data.presentation) notFound();
  const {
    kingdom,
    presentation,
    regions,
    factions,
    characters,
    creatures,
    events,
    gallery,
  } = data;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: kingdom.title,
    description: kingdom.description,
    url: `/world/kingdoms/${kingdom.slug}`,
    containedInPlace: { '@type': 'Place', name: 'Asterheim' },
  };
  const accent =
    presentation.visual === 'ash'
      ? 'text-ember-500'
      : presentation.visual === 'iron'
        ? 'text-aged-gold-500'
        : 'text-parchment-200';
  return (
    <main className={`kingdom-${presentation.visual}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
        type="application/ld+json"
      />
      <section className="relative min-h-[82vh] overflow-hidden">
        <Image
          alt={`Paisagem provisória de ${kingdom.title}`}
          className={`object-cover ${presentation.visual === 'veil' ? 'object-right' : 'object-center'}`}
          fill
          priority
          sizes="100vw"
          src={presentation.landscape}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.96)_5%,rgba(5,5,5,.35)_65%,rgba(5,5,5,.78))]" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-[90rem] flex-col justify-end px-5 py-16 sm:px-8 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="text-parchment-200/60 text-xs uppercase"
          >
            <Link href="/world">Mundo</Link> /{' '}
            <Link href="/world/kingdoms">Reinos</Link> / {kingdom.title}
          </nav>
          <div className="mt-auto max-w-4xl pt-28">
            <span className={`${accent} font-display text-7xl opacity-55`}>
              {presentation.numeral}
            </span>
            <h1 className="font-display mt-3 text-[clamp(3.5rem,10vw,8.5rem)] leading-[.85] uppercase">
              {kingdom.title}
            </h1>
            <p className="text-parchment-200/70 mt-7 max-w-xl text-lg">
              {presentation.climate}
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[90rem] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.65fr_1.35fr] lg:px-12">
        <div>
          <KingdomSigil
            mark={kingdom.sigil}
            name={`Símbolo de ${kingdom.title}`}
          />
          <p className="text-aged-gold-500 mt-8 text-xs tracking-widest uppercase">
            Arquivo editorial provisório
          </p>
        </div>
        <div>
          <h2 className="font-display text-4xl uppercase">Visão geral</h2>
          <p className="text-parchment-200/70 mt-6 max-w-3xl text-xl leading-relaxed">
            {kingdom.description}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Info title="Clima">{presentation.climate}</Info>
            <Info title="Cultura">{presentation.culture}</Info>
            <Info title="Ameaças">{presentation.threats.join(' · ')}</Info>
            <Info title="História">{presentation.history.join(' · ')}</Info>
          </div>
        </div>
      </section>
      <ArchiveSection id="regions" label="Território" title="Regiões">
        <EntityList
          items={regions.map((item) => ({
            title: item.title,
            body: item.climate,
          }))}
        />
      </ArchiveSection>
      <ArchiveSection id="factions" label="Poder" title="Facções">
        <EntityList
          items={factions.map((item) => ({
            title: item.title,
            body: item.excerpt,
          }))}
        />
      </ArchiveSection>
      <ArchiveSection id="characters" label="Testemunhas" title="Personagens">
        <EntityList
          items={characters.map((item) => ({
            title: item.title,
            body: item.role,
          }))}
        />
      </ArchiveSection>
      <ArchiveSection id="creatures" label="Bestiário local" title="Criaturas">
        <EntityList
          items={creatures.map((item) => ({
            title: item.title,
            body: `${item.classification} · ameaça ${item.threatLevel}`,
          }))}
        />
      </ArchiveSection>
      <ArchiveSection id="timeline" label="Memória" title="Timeline local">
        <ol className="border-l border-stone-600/30">
          {events.map((event) => (
            <li
              className="before:bg-aged-gold-500 relative ml-7 pb-8 before:absolute before:top-2 before:-left-[2rem] before:size-2 before:rotate-45"
              key={event.id}
            >
              <span className="text-aged-gold-500 text-xs uppercase">
                {event.dateLabel}
              </span>
              <h3 className="font-display mt-2 text-2xl">{event.title}</h3>
            </li>
          ))}
        </ol>
      </ArchiveSection>
      <ArchiveSection id="gallery" label="Vestígios" title="Galeria">
        <div className="relative min-h-72 overflow-hidden border border-stone-600/30">
          <Image
            alt="Vista ambiental provisória de Asterheim"
            className="object-cover opacity-60"
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            src={presentation.landscape}
          />
          <p className="bg-coal-950/80 absolute right-4 bottom-4 p-3 text-xs uppercase">
            {gallery.length || 1} registro visual provisório
          </p>
        </div>
      </ArchiveSection>
      <section className="border-t border-stone-600/30 px-5 py-24 text-center">
        <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
          Cartografia
        </p>
        <h2 className="font-display mt-4 text-4xl uppercase">
          Encontre este reino no mapa
        </h2>
        <Link
          className="bg-aged-gold-500 text-coal-950 mt-8 inline-flex min-h-12 items-center px-7 text-xs font-bold tracking-widest uppercase"
          href={`/world/map#${kingdom.slug}`}
        >
          Explorar no mapa
        </Link>
      </section>
    </main>
  );
}

function Info({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-stone-600/25 pt-4">
      <h3 className="text-aged-gold-500 text-xs tracking-widest uppercase">
        {title}
      </h3>
      <p className="text-parchment-200/65 mt-3">{children}</p>
    </div>
  );
}
function ArchiveSection({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-stone-600/20" id={id}>
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:px-12">
        <header>
          <p className="text-aged-gold-500 text-xs tracking-widest uppercase">
            {label}
          </p>
          <h2 className="font-display mt-3 text-4xl uppercase">{title}</h2>
        </header>
        <div>{children}</div>
      </div>
    </section>
  );
}
function EntityList({
  items,
}: {
  items: readonly { title: string; body: string }[];
}) {
  return items.length ? (
    <ul className="grid gap-px bg-stone-600/25 sm:grid-cols-2">
      {items.map((item) => (
        <li className="bg-coal-950 min-h-36 p-6" key={item.title}>
          <h3 className="font-display text-2xl">{item.title}</h3>
          <p className="text-parchment-200/55 mt-3 text-sm">{item.body}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-parchment-200/50 border border-stone-600/25 p-6">
      Nenhum registro provisório relacionado.
    </p>
  );
}

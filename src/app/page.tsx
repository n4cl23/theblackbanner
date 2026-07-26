import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { CinematicHeroMedia } from '@/components/shared/cinematic-hero-media';
import { JsonLd } from '@/components/shared/json-ld';
import {
  Container,
  Eyebrow,
  LinkButton,
  SkipLink,
} from '@/components/ui/primitives';
import { siteConfig } from '@/config/site';
import { crowns, guardians } from '@/content/heroic-entities';
import {
  homeDomainArtwork,
  homeDomainOrder,
} from '@/content/home-domains';
import {
  getMiniatures,
  getPublishedCollections,
} from '@/features/collections/data/miniature-repository';
import type {
  Miniature,
  RealCollection,
} from '@/features/collections/domain/miniature-schema';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: 'The Black Banner — Chronicles of Asterheim',
  description:
    'Explore os reinos, coleções, personagens e criaturas do universo dark fantasy de Asterheim.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'The Black Banner — Chronicles of Asterheim',
    description: 'Entre em um mundo de Coroas, juramentos e criaturas antigas.',
    url: '/',
    images: [
      {
        url: '/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-c4760bb6.webp',
        width: 1920,
        height: 1080,
        alt: 'Aster, o coração do mundo de Asterheim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Black Banner — Chronicles of Asterheim',
    description: 'Entre em um mundo de Coroas, juramentos e criaturas antigas.',
    images: [
      '/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-c4760bb6.webp',
    ],
  },
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Black Banner',
    alternateName: 'Chronicles of Asterheim',
    url: siteConfig.url,
    inLanguage: 'pt-BR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Chronicles of Asterheim',
    description:
      'Universo narrativo dark fantasy de The Black Banner.',
    url: siteConfig.url,
    isAccessibleForFree: true,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.creator,
    url: siteConfig.url,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${siteConfig.url}/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-c4760bb6.webp`,
    caption: 'Aster, o coração do mundo de Asterheim',
  },
] as const;

function SectionIntro({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-12 flex items-end justify-between gap-8 sm:mb-16">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display mt-4 max-w-5xl text-[clamp(2.8rem,7vw,6.5rem)] leading-[.86] uppercase">
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          className="text-aged-gold-500 hidden shrink-0 border-b border-current pb-2 text-xs tracking-[.18em] uppercase transition hover:text-white sm:block"
          href={action.href}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="home-cinematic-hero relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black pb-24 sm:items-center sm:pb-0"
    >
      <CinematicHeroMedia />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_72%_18%,rgba(223,190,115,.18)_0%,rgba(124,74,35,.06)_22%,transparent_48%),linear-gradient(105deg,rgba(2,2,2,.98)_0%,rgba(2,2,2,.84)_28%,rgba(2,2,2,.28)_58%,rgba(2,2,2,.08)_76%)]"
      />
      <div
        aria-hidden="true"
        className="hero-light-shaft absolute -top-[18%] right-[10%] -z-10 h-[95%] w-[18%] rotate-[13deg] bg-gradient-to-b from-amber-100/15 via-amber-200/5 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="hero-fog hero-fog-back absolute inset-x-[-15%] bottom-[7%] -z-10 h-[28%] bg-[radial-gradient(ellipse_at_center,rgba(202,199,187,.14),transparent_66%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="hero-fog hero-fog-front absolute inset-x-[-10%] bottom-[-12%] z-10 h-[38%] bg-[radial-gradient(ellipse_at_center,rgba(132,130,122,.18),transparent_64%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,.28)_70%,rgba(0,0,0,.82)_100%),linear-gradient(0deg,#030303_0%,transparent_38%),linear-gradient(180deg,rgba(0,0,0,.72)_0%,transparent_24%)]"
      />

      <Container className="relative z-20">
        <div className="max-w-[62rem]">
          <p className="text-aged-gold-500 mb-6 text-[.62rem] font-medium tracking-[.42em] uppercase sm:mb-8 sm:text-[.7rem]">
            Chronicles of Asterheim
          </p>
          <h1
            className="hero-title text-ivory-100 text-[clamp(4.5rem,12.8vw,12.5rem)] leading-[.74] tracking-[-.035em] uppercase"
            id="home-hero-title"
          >
            <span className="block">The Black</span>
            <span className="block tracking-[-.01em]">
              Banner
            </span>
          </h1>
          <p className="hero-subtitle text-ivory-100/80 mt-9 max-w-md border-l border-aged-gold-500/50 pl-5 text-[.95rem] leading-[1.65] tracking-[.045em] sm:mt-11 sm:pl-6 sm:text-lg">
            Seis Coroas. Um mundo à beira da ruína.
          </p>
          <div className="mt-10 sm:mt-12">
            <LinkButton
              className="hero-primary-cta"
              href="#asterheim"
              size="lg"
              tone="gold"
            >
              Explore Asterheim
            </LinkButton>
          </div>
        </div>
      </Container>

      <a
        aria-label="Rolar para explorar Asterheim"
        className="group absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[.56rem] font-medium tracking-[.34em] text-ivory-100/65 uppercase sm:bottom-7"
        href="#asterheim"
      >
        <span>Explore</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <span className="hero-scroll-line absolute inset-x-0 top-0 h-1/2 bg-aged-gold-500" />
        </span>
      </a>
    </section>
  );
}

function AsterheimSection() {
  const kingdoms = homeDomainOrder.map((slug) => {
    const crown = crowns.find((record) => record.kingdom.slug === slug);
    if (!crown) throw new Error(`Domínio canônico ausente: ${slug}`);

    return {
      title: crown.kingdom.title,
      slug,
      crown: crown.title,
      description: crown.description,
      artwork: homeDomainArtwork[slug],
    };
  });

  return (
    <section
      className="border-y border-aged-gold-500/10 bg-black py-24 sm:py-32 lg:py-40"
      id="asterheim"
    >
      <Container>
        <header className="mx-auto mb-14 max-w-4xl text-center sm:mb-18">
          <Eyebrow>Explore Asterheim</Eyebrow>
          <h2 className="hero-title text-ivory-100 mt-5 text-[clamp(3rem,7vw,6.5rem)] leading-[.84] tracking-[-.025em] uppercase">
            Seis domínios. Um destino.
          </h2>
          <p className="text-parchment-200/75 mx-auto mt-7 max-w-2xl text-sm leading-7 sm:text-base">
            Conheça os seis reinos ligados às Coroas e aos Guardiões de
            Asterheim.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {kingdoms.map((kingdom) => (
            <Link
              className="group domain-card relative aspect-[4/5] overflow-hidden rounded-sm border border-aged-gold-500/30 bg-coal-950 shadow-[0_1.5rem_4rem_rgba(0,0,0,.28)] transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-aged-gold-500/60"
              href={`/pt-br/atlas/reinos/${kingdom.slug}`}
              key={kingdom.slug}
            >
              <Image
                alt={`Paisagem de ${kingdom.title}`}
                className={`object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.025] group-hover:contrast-110 ${kingdom.artwork.position}`}
                fill
                sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
                src={kingdom.artwork.image}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08)_25%,rgba(0,0,0,.42)_58%,rgba(0,0,0,.97)_100%)] transition-colors duration-500 group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,.03)_20%,rgba(0,0,0,.34)_56%,rgba(0,0,0,.96)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-aged-gold-500 text-[.62rem] font-semibold tracking-[.24em] uppercase">
                  {kingdom.crown}
                </p>
                <h3 className="hero-title text-ivory-100 mt-3 text-[clamp(2.1rem,3.4vw,3.25rem)] leading-[.9] tracking-[-.015em] uppercase">
                  {kingdom.title}
                </h3>
                <p className="text-parchment-200/75 mt-4 line-clamp-2 max-w-sm text-sm leading-6">
                  {kingdom.description}
                </p>
                <span className="text-ivory-100 mt-6 inline-flex items-center gap-3 text-[.64rem] font-semibold tracking-[.2em] uppercase">
                  Explorar Reino
                  <span
                    aria-hidden="true"
                    className="text-aged-gold-500 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CollectionsSection({
  collections,
  miniatures,
}: {
  collections: readonly RealCollection[];
  miniatures: readonly Miniature[];
}) {
  return (
    <section className="border-y border-stone-600/20 bg-black py-24 sm:py-36">
      <Container>
        <SectionIntro
          action={{ href: '/pt-br/colecoes', label: 'Todas as coleções' }}
          eyebrow="Featured Collections"
          title="Exércitos, tavernas e lendas"
        />
        <div className="grid gap-4 lg:grid-cols-12">
          {collections.slice(0, 5).map((collection, index) => {
            const count = miniatures.filter(
              (miniature) => miniature.collectionSlug === collection.slug,
            ).length;
            return (
              <Link
                className={`group relative min-h-[28rem] overflow-hidden ${
                  index < 2 ? 'lg:col-span-6' : 'lg:col-span-4'
                }`}
                href={`/pt-br/colecoes/${collection.slug}`}
                key={collection.id}
              >
                <Image
                  alt={collection.cover?.alt ?? collection.title}
                  className="object-cover opacity-65 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-85"
                  fill
                  sizes={index < 2 ? '50vw' : '33vw'}
                  src={
                    collection.cover?.src ??
                    '/images/home/asterheim-hero.webp'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-aged-gold-500 text-xs tracking-[.2em] uppercase">
                    {count} miniaturas
                  </p>
                  <h3 className="font-display mt-3 text-4xl uppercase">
                    {collection.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function MiniaturesSection({
  miniatures,
}: {
  miniatures: readonly Miniature[];
}) {
  return (
    <section className="bg-coal-950 py-24 sm:py-36">
      <Container>
        <SectionIntro
          action={{ href: '/pt-br/miniaturas', label: 'Abrir catálogo' }}
          eyebrow={`${miniatures.length} miniaturas públicas`}
          title="Latest Miniatures"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {miniatures.map((miniature, index) => (
            <Link
              className={`group relative overflow-hidden bg-black ${
                index % 11 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
              href={`/pt-br/miniaturas/${miniature.slug}`}
              key={miniature.id}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  alt={miniature.cover?.alt ?? miniature.title}
                  className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-90"
                  fill
                  loading="lazy"
                  sizes={
                    index % 11 === 0
                      ? '(max-width: 1024px) 100vw, 50vw'
                      : '(max-width: 640px) 100vw, 25vw'
                  }
                  src={
                    miniature.cover?.src ??
                    '/images/home/asterheim-hero.webp'
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="text-aged-gold-500 text-[.62rem] tracking-[.18em] uppercase">
                    {miniature.collectionTitle}
                  </p>
                  <h3 className="font-display mt-2 text-2xl uppercase sm:text-3xl">
                    {miniature.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CharactersSection() {
  return (
    <section className="border-y border-stone-600/20 bg-black py-24 sm:py-36">
      <Container>
        <SectionIntro
          action={{ href: '/guardioes', label: 'Conhecer Guardiões' }}
          eyebrow="Characters"
          title="Aqueles que carregam as Coroas"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guardians.map((guardian, index) => (
            <Link
              className={`group relative overflow-hidden ${
                index === 0 ? 'min-h-[42rem] lg:col-span-2' : 'min-h-[30rem]'
              }`}
              href={`/guardioes/${guardian.slug}`}
              key={guardian.id}
            >
              <Image
                alt={`Retrato de ${guardian.title}`}
                className="object-cover opacity-60 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-80"
                fill
                sizes={index === 0 ? '66vw' : '33vw'}
                src={
                  guardian.media[0]?.url ??
                  '/images/home/asterheim-hero.webp'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-aged-gold-500 text-xs uppercase">
                  {guardian.kingdom.title}
                </p>
                <h3 className="font-display mt-3 text-4xl uppercase sm:text-5xl">
                  {guardian.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CreaturesSection({
  creatures,
}: {
  creatures: readonly Miniature[];
}) {
  return (
    <section className="bg-coal-950 py-24 sm:py-36">
      <Container>
        <SectionIntro
          action={{ href: '/bestiario', label: 'Abrir Bestiário' }}
          eyebrow="Legendary Creatures"
          title="O que desperta sob a pedra"
        />
        <div className="grid gap-3 lg:grid-cols-12">
          {creatures.slice(0, 5).map((creature, index) => (
            <Link
              className={`group relative min-h-[32rem] overflow-hidden ${
                index === 0 ? 'lg:col-span-8 lg:row-span-2' : 'lg:col-span-4'
              }`}
              href={`/pt-br/miniaturas/${creature.slug}`}
              key={creature.id}
            >
              <Image
                alt={creature.cover?.alt ?? creature.title}
                className="object-cover opacity-60 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-85"
                fill
                sizes={index === 0 ? '66vw' : '33vw'}
                src={
                  creature.cover?.src ?? '/images/home/bestiary-ruins.webp'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="text-ember-600 text-xs tracking-[.18em] uppercase">
                  {creature.collectionTitle}
                </p>
                <h3 className="font-display mt-3 text-4xl uppercase">
                  {creature.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function AtlasSection() {
  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden border-y border-stone-600/20">
      <Image
        alt="Mapa de Ironhold no Atlas de Asterheim"
        className="-z-20 object-cover opacity-65"
        fill
        sizes="100vw"
        src="/media/asterheim/entities/iron-hold-map/iron-hold-map-eb8924fe.webp"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/35 to-transparent" />
      <Container className="flex min-h-[90vh] items-end py-20 sm:items-center">
        <div className="max-w-xl">
          <Eyebrow>Atlas Preview</Eyebrow>
          <h2 className="font-display mt-5 text-[clamp(4rem,9vw,8rem)] leading-[.82] uppercase">
            Atravesse Asterheim
          </h2>
          <div className="mt-9">
            <LinkButton href="/pt-br/atlas" size="lg" tone="gold">
              Explorar o mapa
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="bg-black py-24 sm:py-36">
      <Container>
        <SectionIntro
          action={{ href: '/timeline', label: 'Abrir cronologia' }}
          eyebrow="Timeline Preview"
          title="Ecos através das eras"
        />
        <ol className="grid gap-px bg-stone-600/25 lg:grid-cols-3">
          {crowns.slice(0, 3).map((crown, index) => (
            <li className="bg-coal-950 min-h-72 p-8 sm:p-10" key={crown.id}>
              <p className="text-aged-gold-500 text-xs tracking-[.18em] uppercase">
                0{index + 1} · {crown.force}
              </p>
              <h3 className="font-display mt-12 text-4xl uppercase">
                {crown.title}
              </h3>
              <p className="text-parchment-200/55 mt-5 line-clamp-3 text-sm leading-relaxed">
                {crown.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function PrintingSection({ miniature }: { miniature: Miniature | undefined }) {
  return (
    <section className="relative isolate min-h-[75vh] overflow-hidden border-y border-stone-600/20">
      <Image
        alt={miniature?.cover?.alt ?? 'Miniatura de Asterheim pronta para impressão'}
        className="-z-20 object-cover object-[70%_center] opacity-55"
        fill
        sizes="100vw"
        src={miniature?.cover?.src ?? '/images/home/asterheim-hero.webp'}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-transparent" />
      <Container className="flex min-h-[75vh] items-center">
        <div className="max-w-2xl">
          <Eyebrow>3D Printing</Eyebrow>
          <h2 className="font-display mt-5 text-[clamp(3.5rem,8vw,7rem)] leading-[.85] uppercase">
            Do códice para a mesa
          </h2>
          <div className="mt-9 flex flex-wrap gap-4">
            <LinkButton href="/guia-de-impressao" size="lg" tone="gold">
              Guia de impressão
            </LinkButton>
            <LinkButton href="/pt-br/miniaturas" size="lg">
              Explorar modelos
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage() {
  const [collections, miniatures] = await Promise.all([
    getPublishedCollections('pt-br'),
    getMiniatures('pt-br'),
  ]);
  const publishedCreatures = miniatures.filter(
    (miniature) =>
      miniature.entityType === 'creature' &&
      miniature.status === 'published',
  );

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <AsterheimSection />
        <CollectionsSection
          collections={collections}
          miniatures={miniatures}
        />
        <MiniaturesSection miniatures={miniatures} />
        <CharactersSection />
        <CreaturesSection creatures={publishedCreatures} />
        <AtlasSection />
        <TimelineSection />
        <PrintingSection miniature={miniatures.find((item) => item.featured)} />
      </main>
      <SiteFooter />
      <JsonLd data={structuredData} />
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLd } from '@/components/shared/json-ld';
import { ImageWithFallback } from '@/components/ui/interactive';
import {
  Container,
  Eyebrow,
  LinkButton,
  SkipLink,
} from '@/components/ui/primitives';
import { siteConfig } from '@/config/site';
import { crowns, guardians } from '@/content/heroic-entities';
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
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black pb-16 sm:items-center sm:pb-0"
    >
      <ImageWithFallback
        alt="Aster, o coração do mundo de Asterheim, diante de uma paisagem monumental"
        className="-z-30 object-cover object-[64%_center]"
        fallback="A paisagem de Asterheim não pôde ser carregada"
        fill
        priority
        sizes="100vw"
        src="/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-c4760bb6.webp"
      />
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 -z-20 hidden size-full object-cover opacity-60 motion-safe:lg:block"
        loop
        muted
        playsInline
        poster="/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-c4760bb6.webp"
        preload="metadata"
      >
        <source
          src="/media/asterheim/entities/aster-the-world-heart/aster-the-world-heart-35aad744.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,3,3,.98)_0%,rgba(3,3,3,.72)_38%,rgba(3,3,3,.08)_75%),linear-gradient(0deg,#050505_0%,transparent_48%),linear-gradient(180deg,rgba(0,0,0,.6),transparent_30%)]" />
      <Container className="relative">
        <div className="max-w-4xl">
          <Eyebrow>Chronicles of Asterheim</Eyebrow>
          <h1
            className="font-display mt-5 text-[clamp(4rem,11vw,10rem)] leading-[.75] tracking-[.025em] uppercase [text-shadow:0_4px_40px_#000]"
            id="home-hero-title"
          >
            The Black
            <span className="text-parchment-200 block">Banner</span>
          </h1>
          <p className="text-parchment-200/75 mt-8 max-w-lg text-base leading-relaxed sm:text-xl">
            Seis Coroas. Antigos juramentos. Um mundo à beira da ruína.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <LinkButton href="#asterheim" size="lg" tone="gold">
              Explore Asterheim
            </LinkButton>
            <LinkButton href="/pt-br/miniaturas" size="lg">
              Ver miniaturas
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

function AsterheimSection() {
  const kingdoms = guardians.map((guardian) => ({
    title: guardian.kingdom.title,
    slug: guardian.kingdom.slug,
    image: guardian.media[0]?.url,
    guardian: guardian.title,
  }));

  return (
    <section className="bg-coal-950 py-24 sm:py-36" id="asterheim">
      <Container>
        <SectionIntro
          action={{ href: '/pt-br/atlas', label: 'Abrir Atlas' }}
          eyebrow="Explore Asterheim"
          title="Seis domínios. Um destino."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {kingdoms.map((kingdom, index) => (
            <Link
              className={`group relative overflow-hidden border border-stone-600/20 ${
                index === 0 ? 'min-h-[34rem] xl:row-span-2' : 'min-h-[22rem]'
              }`}
              href="/pt-br/atlas"
              key={kingdom.slug}
            >
              <Image
                alt={`Paisagem associada a ${kingdom.title}`}
                className="object-cover opacity-55 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-75"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src={
                  kingdom.image ??
                  '/media/asterheim/entities/legends-of-the-realm/beasts-hero-d376cfd6.webp'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="text-aged-gold-500 text-[.65rem] tracking-[.22em] uppercase">
                  Reino do Guardião {kingdom.guardian}
                </p>
                <h3 className="font-display mt-3 text-4xl uppercase">
                  {kingdom.title}
                </h3>
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

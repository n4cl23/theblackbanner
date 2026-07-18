import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {
  featuredCharacters,
  featuredCollections,
  featuredCreatures,
  featuredKingdoms,
  featuredStories,
} from '@/content/home.mock';
import { SiteHeader } from '@/components/layout/site-header';
import { ImageWithFallback } from '@/components/ui/interactive';
import {
  Badge,
  Container,
  Eyebrow,
  LinkButton,
  OrnamentalDivider,
  SectionHeading,
  SkipLink,
} from '@/components/ui/primitives';

const provisionalBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(provisionalBaseUrl),
  title: 'The Black Banner V2 — Chronicles of Asterheim',
  description:
    'Entre em Asterheim: um universo de fantasia sombria moldado por reinos antigos, criaturas, guerra e exploração.',
  alternates: { canonical: new URL('/', provisionalBaseUrl) },
  openGraph: {
    type: 'website',
    title: 'The Black Banner V2 — Chronicles of Asterheim',
    description:
      'Uma introdução cinematográfica ao universo sombrio de Asterheim.',
    url: new URL('/', provisionalBaseUrl),
    images: [
      {
        url: new URL('/images/home/asterheim-hero.webp', provisionalBaseUrl),
        width: 1920,
        height: 818,
        alt: 'Fortaleza monumental nas montanhas de Asterheim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Black Banner V2 — Chronicles of Asterheim',
    description: 'Mistério, guerra e descoberta em um mundo antigo.',
    images: ['/images/home/asterheim-hero.webp'],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Black Banner V2',
  alternateName: 'Chronicles of Asterheim',
  url: provisionalBaseUrl,
  inLanguage: ['pt-BR', 'en'],
} as const;

const creativeWorkJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'The Black Banner V2 — Chronicles of Asterheim',
  description:
    'Digital dark-fantasy universe and editorial experience in development.',
  isAccessibleForFree: true,
  url: provisionalBaseUrl,
} as const;

function MockLabel() {
  return (
    <span className="text-[0.62rem] font-bold tracking-[0.16em] text-stone-600 uppercase">
      Arquivo demonstrativo
    </span>
  );
}

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black pt-32 pb-20 sm:items-center sm:pb-0"
    >
      <div className="absolute inset-0 -z-30">
        <ImageWithFallback
          alt="Uma fortaleza monumental de Asterheim além de um vale coberto por cinzas"
          className="object-cover object-[62%_center] sm:object-center"
          fallback="A paisagem de Asterheim não pôde ser carregada"
          fill
          priority
          sizes="100vw"
          src="/images/home/asterheim-hero.webp"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.72)_35%,rgba(5,5,5,0.08)_70%),linear-gradient(0deg,rgba(5,5,5,0.95)_0%,transparent_45%),linear-gradient(180deg,rgba(5,5,5,0.5),transparent_30%)]"
      />
      <Container>
        <div className="section-reveal max-w-3xl">
          <Eyebrow>Chronicles of Asterheim</Eyebrow>
          <h1
            className="font-display text-ivory-100 mt-5 text-[clamp(3rem,8vw,7.8rem)] leading-[0.86] tracking-[0.035em] uppercase [text-shadow:0_3px_30px_rgba(0,0,0,0.85)]"
            id="hero-title"
          >
            The Black <span className="text-parchment-200 block">Banner</span>
          </h1>
          <p className="text-parchment-200/75 mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
            Além da estrada afogada, velhos reinos aguardam sob a cinza. Cada
            ruína guarda uma guerra. Cada silêncio, uma ameaça.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <LinkButton href="#asterheim" size="lg" tone="gold">
              Entrar em Asterheim
            </LinkButton>
            <LinkButton href="#collections" size="lg">
              Explorar coleções
            </LinkButton>
          </div>
        </div>
      </Container>
      <Link
        aria-label="Rolar para a introdução a Asterheim"
        className="text-parchment-200/50 absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] tracking-[0.25em] uppercase sm:flex"
        href="#asterheim"
      >
        Descer
        <span
          aria-hidden="true"
          className="from-aged-gold-500 h-9 w-px bg-gradient-to-b to-transparent motion-safe:animate-pulse"
        />
      </Link>
    </section>
  );
}

function IntroductionSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-36" id="asterheim">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="font-display text-aged-gold-500/15 text-8xl leading-none sm:text-9xl">
              ᚨ
            </span>
            <SectionHeading
              description="Asterheim será apresentado como um território vivo: camadas de história, fronteiras hostis e caminhos que existem antes dos heróis que os atravessam."
              eyebrow="Um mundo sob a cinza"
              title="O ambiente guarda a primeira memória"
            />
          </div>
          <div className="relative min-h-[28rem] overflow-hidden border border-stone-600/25 shadow-[var(--shadow-deep)]">
            <Image
              alt="Estrada de pedra atravessando uma planície antiga entre cidadelas"
              className="object-cover"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 58vw"
              src="/images/home/kingdoms-expanse.webp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <p className="text-parchment-200/70 absolute right-6 bottom-6 left-6 max-w-md text-sm">
              Arte conceitual original · conteúdo narrativo ainda não canônico
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function KingdomsSection() {
  return (
    <section
      className="relative isolate overflow-hidden border-y border-stone-600/20 py-24 sm:py-36"
      id="kingdoms"
    >
      <Image
        alt="Três cidadelas distantes sobre uma planície alagada"
        className="-z-30 object-cover opacity-45"
        fill
        loading="lazy"
        sizes="100vw"
        src="/images/home/kingdoms-expanse.webp"
      />
      <div className="from-coal-950 via-coal-950/80 to-coal-950/30 absolute inset-0 -z-20 bg-gradient-to-r" />
      <Container>
        <SectionHeading
          description="Três exemplos tipados demonstram como territórios futuros poderão ser apresentados sem antecipar o lore oficial."
          eyebrow="Fronteiras demonstrativas"
          title="Reinos separados pela mesma guerra"
        />
        <div className="mt-14 grid gap-px bg-stone-600/25 lg:grid-cols-3">
          {featuredKingdoms.map((kingdom, index) => (
            <article
              className="group bg-coal-950/90 hover:bg-iron-800/90 relative min-h-80 p-7 transition-colors sm:p-9"
              key={kingdom.id}
            >
              <span
                className="font-display text-aged-gold-500/55 text-5xl"
                aria-hidden="true"
              >
                {kingdom.sigil}
              </span>
              <p className="text-parchment-200/45 mt-12 text-xs tracking-wider uppercase">
                0{index + 1} · {kingdom.epithet}
              </p>
              <h3 className="font-display text-ivory-100 mt-3 text-2xl">
                {kingdom.name}
              </h3>
              <p className="text-parchment-200/60 mt-4 text-sm">
                {kingdom.summary}
              </p>
              <div className="mt-7">
                <MockLabel />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CharactersSection() {
  return (
    <section className="py-24 sm:py-36" id="characters">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHeading
            description="Figuras pequenas diante de um mundo imenso. Nunca retratos isolados, sempre presenças inseridas no caminho."
            eyebrow="Vozes ainda sem registro"
            title="Personagens em destaque"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {featuredCharacters.map((character, index) => (
              <article
                className="from-iron-800 relative min-h-[28rem] overflow-hidden border border-stone-600/25 bg-gradient-to-b to-black p-7"
                key={character.id}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(ellipse_at_bottom,rgba(168,61,31,0.18),transparent_58%)]"
                />
                <div
                  aria-hidden="true"
                  className="absolute right-[18%] bottom-0 h-[60%] w-[23%] bg-black/90 [clip-path:polygon(40%_0,65%_8%,70%_28%,100%_100%,0_100%,28%_28%)]"
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <Badge>{character.role}</Badge>
                    <span className="text-parchment-200/35 text-xs">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <MockLabel />
                    <h3 className="font-display mt-3 text-3xl">
                      {character.name}
                    </h3>
                    <p className="text-aged-gold-500 mt-2 text-xs tracking-wider uppercase">
                      {character.allegiance}
                    </p>
                    <p className="text-parchment-200/60 mt-4 max-w-xs text-sm">
                      {character.summary}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function BestiarySection() {
  return (
    <section
      className="relative isolate min-h-[48rem] overflow-hidden border-y border-stone-600/20 py-24 sm:py-36"
      id="bestiary"
    >
      <Image
        alt="Ossos colossais entre árvores petrificadas e torres em ruínas"
        className="-z-30 object-cover object-[62%_center]"
        fill
        loading="lazy"
        sizes="100vw"
        src="/images/home/bestiary-ruins.webp"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-black/95 via-black/65 to-transparent" />
      <Container>
        <div className="max-w-xl">
          <SectionHeading
            description="O bestiário começa pelos vestígios. Pegadas, ossos e silêncio revelam mais do que uma criatura posando para o observador."
            eyebrow="Sinais na escuridão"
            title="Há coisas antigas sob as ruínas"
          />
          <div className="mt-10 divide-y divide-stone-600/30 border-y border-stone-600/30">
            {featuredCreatures.map((creature) => (
              <article className="py-6" key={creature.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xl">{creature.name}</h3>
                  <span className="text-ember-600 text-xs tracking-wider uppercase">
                    Ameaça: {creature.threat}
                  </span>
                </div>
                <p className="text-parchment-200/45 mt-2 text-xs tracking-wider uppercase">
                  {creature.classification}
                </p>
                <p className="text-parchment-200/60 mt-3 text-sm">
                  {creature.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="py-24 sm:py-36" id="collections">
      <Container>
        <SectionHeading
          align="center"
          description="Uma antevisão visual para futuras miniaturas e arquivos, sem downloads, venda ou integração comercial."
          eyebrow="Objetos do mundo"
          title="Coleções moldadas pela narrativa"
        />
        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {featuredCollections.map((collection, index) => (
            <article
              className="group bg-coal-900 relative min-h-96 overflow-hidden border border-stone-600/25 p-8"
              key={collection.id}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(168,138,69,0.14),transparent_22%),linear-gradient(135deg,transparent,rgba(0,0,0,0.75))] transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-display text-aged-gold-500/30 text-6xl">
                    0{index + 1}
                  </span>
                  <Badge>{collection.itemCount} estudos</Badge>
                </div>
                <div>
                  <MockLabel />
                  <h3 className="font-display mt-3 text-3xl">
                    {collection.name}
                  </h3>
                  <p className="text-aged-gold-500 mt-2 text-xs tracking-wider uppercase">
                    {collection.format}
                  </p>
                  <p className="text-parchment-200/60 mt-4 max-w-md text-sm">
                    {collection.summary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TimelineSection() {
  return (
    <section
      className="bg-coal-900/70 border-y border-stone-600/20 py-24 sm:py-36"
      id="timeline"
    >
      <Container>
        <SectionHeading
          description="Uma estrutura editorial demonstrativa preparada para receber datas e eventos aprovados em sprint futura."
          eyebrow="Cronologia provisória"
          title="Ecos através das eras"
        />
        <ol className="relative mt-16 grid gap-10 before:absolute before:top-0 before:bottom-0 before:left-3 before:w-px before:bg-stone-600/35 md:grid-cols-3 md:before:top-3 md:before:right-0 md:before:bottom-auto md:before:left-0 md:before:h-px md:before:w-auto">
          {featuredStories.map((story, index) => (
            <li
              className="relative pl-12 md:pt-10 md:pr-8 md:pl-0"
              key={story.id}
            >
              <span className="border-aged-gold-500 bg-coal-900 absolute top-2 left-1.5 size-3 rotate-45 border md:top-1.5 md:left-0" />
              <p className="text-aged-gold-500 text-xs tracking-wider uppercase">
                {story.dateLabel}
              </p>
              <h3 className="font-display mt-3 text-2xl">{story.name}</h3>
              <p className="text-parchment-200/40 mt-1 text-xs">
                {story.chapter} · 0{index + 1}
              </p>
              <p className="text-parchment-200/60 mt-4 text-sm">
                {story.summary}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function GallerySection() {
  const images = [
    {
      src: '/images/home/asterheim-hero.webp',
      alt: 'Fortaleza antiga entre montanhas',
      label: 'A cidadela distante',
    },
    {
      src: '/images/home/kingdoms-expanse.webp',
      alt: 'Planície alagada e cidadelas',
      label: 'A estrada afogada',
    },
    {
      src: '/images/home/bestiary-ruins.webp',
      alt: 'Ossos colossais em floresta petrificada',
      label: 'Vestígios na mata',
    },
  ] as const;

  return (
    <section className="py-24 sm:py-36" id="gallery">
      <Container>
        <SectionHeading
          description="Estudos de ambiente originais criados para esta Home. Nenhuma imagem foi reutilizada da versão anterior."
          eyebrow="Visões de Asterheim"
          title="Galeria de atmosferas"
        />
        <div className="mt-14 grid auto-rows-[16rem] gap-3 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <figure
              className={
                index === 0
                  ? 'group relative overflow-hidden border border-stone-600/25 md:row-span-2 lg:col-span-2'
                  : 'group relative overflow-hidden border border-stone-600/25'
              }
              key={image.src}
            >
              <Image
                alt={image.alt}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
                fill
                loading="lazy"
                sizes={
                  index === 0
                    ? '(max-width: 1024px) 100vw, 66vw'
                    : '(max-width: 1024px) 100vw, 33vw'
                }
                src={image.src}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <figcaption className="text-parchment-200/70 absolute right-5 bottom-5 left-5 text-xs tracking-[0.16em] uppercase">
                {image.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function EditorialSection() {
  return (
    <section
      className="bg-iron-800 relative overflow-hidden border-y border-stone-600/20 py-24 sm:py-32"
      id="editorial"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--texture-metal)] opacity-60"
      />
      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <Eyebrow>Arquivos editoriais</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-tight sm:text-6xl">
              Toda guerra deixa um registro. Nem todo registro diz a verdade.
            </h2>
            <p className="text-parchment-200/65 mt-6 max-w-2xl">
              Esta chamada prepara o espaço para ensaios, crônicas e bastidores
              futuros. O texto atual é demonstrativo.
            </p>
          </div>
          <LinkButton href="#timeline" size="lg">
            Consultar cronologia
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-24 sm:py-32" id="newsletter">
      <Container>
        <div className="border-aged-gold-500/30 mx-auto max-w-4xl border-y py-16 text-center">
          <Eyebrow>Transmissões futuras</Eyebrow>
          <h2 className="font-display mt-5 text-3xl sm:text-5xl">
            Receba sinais além da muralha
          </h2>
          <p className="text-parchment-200/60 mx-auto mt-5 max-w-xl text-sm">
            Campo visual sem integração ou armazenamento de dados nesta sprint.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              E-mail
            </label>
            <input
              className="text-ivory-100 placeholder:text-parchment-200/35 min-h-12 flex-1 border border-stone-600/40 bg-black px-4 text-sm"
              id="newsletter-email"
              name="email"
              placeholder="seu@email.com"
              type="email"
            />
            <button
              className="border-aged-gold-500 bg-aged-gold-500 text-coal-950 min-h-12 border px-6 text-xs font-bold tracking-wider uppercase"
              type="button"
            >
              Em breve
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-stone-600/25 bg-black py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
          <div>
            <p className="font-display text-xl tracking-wider uppercase">
              The Black Banner V2
            </p>
            <p className="text-aged-gold-500 mt-2 text-xs tracking-[0.2em] uppercase">
              Chronicles of Asterheim
            </p>
            <p className="text-parchment-200/40 mt-5 max-w-md text-xs">
              Home cinematográfica em desenvolvimento. Entradas narrativas
              marcadas como demonstrativas não constituem conteúdo oficial.
            </p>
          </div>
          <nav aria-label="Footer universe navigation">
            <p className="text-parchment-200/70 text-xs font-bold tracking-wider uppercase">
              Universo
            </p>
            <ul className="text-parchment-200/45 mt-4 space-y-2 text-sm">
              <li>
                <Link href="#kingdoms">Reinos</Link>
              </li>
              <li>
                <Link href="#characters">Personagens</Link>
              </li>
              <li>
                <Link href="#bestiary">Bestiário</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Footer project navigation">
            <p className="text-parchment-200/70 text-xs font-bold tracking-wider uppercase">
              Projeto
            </p>
            <ul className="text-parchment-200/45 mt-4 space-y-2 text-sm">
              <li>
                <Link href="#gallery">Galeria</Link>
              </li>
              <li>
                <Link href="#collections">Coleções</Link>
              </li>
              <li>
                <Link href="/design-system">Design system</Link>
              </li>
            </ul>
          </nav>
        </div>
        <OrnamentalDivider className="my-10" />
        <p className="text-parchment-200/30 text-center text-[0.65rem] tracking-wider uppercase">
          © 2026 The Black Banner V2 · Ambiente de desenvolvimento
        </p>
      </Container>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <IntroductionSection />
        <KingdomsSection />
        <CharactersSection />
        <BestiarySection />
        <CollectionsSection />
        <TimelineSection />
        <GallerySection />
        <EditorialSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
        type="application/ld+json"
      />
    </>
  );
}

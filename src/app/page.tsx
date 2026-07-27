import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { CinematicHeroMedia } from '@/components/shared/cinematic-hero-media';
import { KingdomEditorialJourney } from '@/components/shared/home-editorial-journey';
import { JsonLd } from '@/components/shared/json-ld';
import {
  Container,
  Eyebrow,
  LinkButton,
  SkipLink,
} from '@/components/ui/primitives';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/config/i18n';
import { crowns, guardians } from '@/content/heroic-entities';
import {
  homeDomainArtwork,
  homeDomainOrder,
} from '@/content/home-domains';
import {
  getMiniatures,
  getPublishedCollections,
} from '@/features/collections/data/miniature-repository';
import {
  getHomeMessages,
  type HomeMessages,
} from '@/features/i18n/data/home-translations';
import { localizedPath } from '@/features/i18n/data/route-registry';
import type {
  Miniature,
  RealCollection,
} from '@/features/collections/domain/miniature-schema';

function getStructuredData(locale: Locale) {
  const inLanguage = locale === 'pt-br' ? 'pt-BR' : locale;
  const description = {
    'pt-br': 'Universo narrativo dark fantasy de The Black Banner.',
    en: 'The dark fantasy narrative universe of The Black Banner.',
    es: 'El universo narrativo dark fantasy de The Black Banner.',
  }[locale];
  return [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Black Banner',
    alternateName: 'Chronicles of Asterheim',
    url: siteConfig.url,
    inLanguage,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Chronicles of Asterheim',
    description,
    url: `${siteConfig.url}/${locale}`,
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
}

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
    <div className="section-intro mb-12 flex items-end justify-between gap-8 sm:mb-16">
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

function Hero({ messages }: { messages: HomeMessages }) {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="home-cinematic-hero relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black pb-24 sm:items-center sm:pb-0"
      id="chapter-banner"
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
            {messages.heroTagline}
          </p>
          <div className="mt-10 sm:mt-12">
            <LinkButton
              className="hero-primary-cta"
              href="#asterheim"
              size="lg"
              tone="gold"
            >
              {messages.heroCta}
            </LinkButton>
          </div>
        </div>
      </Container>

      <a
        aria-label="Rolar para explorar Asterheim"
        className="group absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[.56rem] font-medium tracking-[.34em] text-ivory-100/65 uppercase sm:bottom-7"
        href="#asterheim"
      >
        <span>{messages.scrollLabel}</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <span className="hero-scroll-line absolute inset-x-0 top-0 h-1/2 bg-aged-gold-500" />
        </span>
      </a>
    </section>
  );
}

function AsterheimSection({
  locale,
  messages,
}: {
  locale: Locale;
  messages: HomeMessages;
}) {
  const kingdoms = homeDomainOrder.map((slug) => {
    const crown = crowns.find((record) => record.kingdom.slug === slug);
    if (!crown) throw new Error(`Domínio canônico ausente: ${slug}`);

    return {
      title: crown.kingdom.title,
      slug,
      artwork: homeDomainArtwork[slug],
    };
  });

  return (
    <section
      className="kingdom-domain border-t border-aged-gold-500/10 bg-black pt-20 sm:pt-24 lg:pt-28"
      id="asterheim"
    >
      <Container className="max-w-[97.5rem]">
        <header className="kingdom-domain__header mx-auto mb-10 max-w-[56rem] text-center sm:mb-12">
          <Eyebrow>{messages.domainsEyebrow}</Eyebrow>
          <h2 className="hero-title text-ivory-100 mt-5 text-[clamp(3rem,5vw,5.8rem)] leading-[.9] tracking-[-.025em] uppercase sm:mt-6">
            {messages.domainsTitle}
          </h2>
          <p className="text-parchment-200/75 mx-auto mt-5 max-w-3xl text-sm leading-7 sm:mt-6 sm:text-base">
            {messages.domainsBody}
          </p>
        </header>

        <KingdomEditorialJourney
          locale={locale}
          kingdoms={kingdoms.map((kingdom) => ({
            artwork: kingdom.artwork.image,
            fit: kingdom.artwork.fit,
            objectPosition: kingdom.artwork.objectPosition,
            slug: kingdom.slug,
            title: kingdom.title,
          }))}
        />
        <div className="kingdom-domain__footer">
          <Link href={localizedPath(locale, 'atlas')}>
            {messages.atlasCta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function CollectionsSection({
  collections,
  locale,
  messages,
  miniatures,
}: {
  collections: readonly RealCollection[];
  locale: Locale;
  messages: HomeMessages;
  miniatures: readonly Miniature[];
}) {
  const featuredOrder = [
    'beasts-of-asterheim',
    'boss-collection',
    'the-broken-mug-tavern',
  ] as const;
  const collectionDescriptions: Record<(typeof featuredOrder)[number], string> =
    {
      'beasts-of-asterheim':
        'Criaturas ancestrais, predadores e lendas nascidas nos seis reinos.',
      'boss-collection':
        'Adversários monumentais que guardam as fronteiras de Asterheim.',
      'the-broken-mug-tavern':
        'Forasteiros, histórias e perigos reunidos sob o mesmo teto.',
    };
  const featured = featuredOrder.map((slug) => {
    const collection = collections.find((item) => item.slug === slug);
    if (!collection) throw new Error(`Coleção publicada ausente: ${slug}`);

    return {
      collection,
      count: miniatures.filter(
        (miniature) => miniature.collectionSlug === slug,
      ).length,
      description: collectionDescriptions[slug],
    };
  });
  const [primary, boss, tavern] = featured;
  if (!primary || !boss || !tavern) return null;

  return (
    <section
      className="featured-collections-domain relative isolate overflow-hidden border-y border-stone-600/20 bg-black py-20 sm:py-24 lg:py-28"
      id="chapter-collections"
    >
      <Container className="max-w-[97.5rem]">
        <header className="featured-collections-domain__header">
          <div>
            <Eyebrow>{messages.collectionsEyebrow}</Eyebrow>
            <h2 className="hero-title text-ivory-100 mt-5 max-w-[59.375rem] text-[clamp(3.25rem,6vw,7.5rem)] leading-[.92] tracking-[-.025em] uppercase sm:mt-6">
              <span className="block">{messages.collectionsTitleFirst}</span>
              <span className="block">{messages.collectionsTitleSecond}</span>
            </h2>
          </div>
        </header>

        <div className="featured-showcase">
          <Link
            className="featured-collection featured-collection--primary"
            href={localizedPath(locale, `colecoes/${primary.collection.slug}`)}
          >
            <div className="featured-collection__media">
              <Image
                alt={
                  primary.collection.cover?.alt ?? primary.collection.title
                }
                className="featured-collection__image"
                fill
                sizes="(max-width: 1023px) 100vw, 66vw"
                src={
                  primary.collection.cover?.src ??
                  '/images/home/asterheim-hero.webp'
                }
              />
              <div className="featured-collection__shade" />
            </div>
            <div className="featured-collection__content">
              <p className="featured-collection__count">
                {primary.count} {messages.miniatureCount}
              </p>
              <h3>{primary.collection.title}</h3>
              <p className="featured-collection__description">
                {primary.description}
              </p>
              <span className="featured-collection__cta">
                {messages.collectionCta} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          <div className="featured-showcase__secondary">
            <Link
              className="featured-collection featured-collection--boss"
              href={localizedPath(locale, `colecoes/${boss.collection.slug}`)}
            >
              <div className="featured-collection__media">
                <Image
                  alt={boss.collection.cover?.alt ?? boss.collection.title}
                  className="featured-collection__image"
                  fill
                  sizes="(max-width: 1023px) 100vw, 35vw"
                  src={
                    boss.collection.cover?.src ??
                    '/images/home/asterheim-hero.webp'
                  }
                />
                <div className="featured-collection__ambient featured-collection__ambient--boss" />
                <div className="featured-collection__shade" />
              </div>
              <div className="featured-collection__content">
                <p className="featured-collection__count">
                  {boss.count} {messages.miniatureCount}
                </p>
                <h3>{boss.collection.title}</h3>
                <p className="featured-collection__description">
                  {boss.description}
                </p>
                <span className="featured-collection__cta">
                  {messages.collectionCta} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>

            <div className="featured-showcase__minor">
              {[tavern].map(
                ({ collection, count, description }) => (
                  <Link
                    className="featured-collection featured-collection--minor featured-collection--compact"
                    href={localizedPath(locale, `colecoes/${collection.slug}`)}
                    key={collection.id}
                  >
                    <div className="featured-collection__media">
                      <Image
                        alt={collection.cover?.alt ?? collection.title}
                        className="featured-collection__image"
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 18vw"
                        src={
                          collection.cover?.src ??
                          '/images/home/asterheim-hero.webp'
                        }
                      />
                      <div className="featured-collection__ambient featured-collection__ambient--tavern" />
                      <div className="featured-collection__shade" />
                    </div>
                    <div className="featured-collection__content">
                      <p className="featured-collection__count">
                        {count} {messages.miniatureCount}
                      </p>
                      <h3>{collection.title}</h3>
                      <p className="featured-collection__description">
                        {description}
                      </p>
                      <span className="featured-collection__cta">
                        {messages.collectionCta}{' '}
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="featured-showcase__footer">
          <p>{messages.collectionsOutro}</p>
          <Link href={localizedPath(locale, 'colecoes')}>
            {messages.allCollectionsCta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function MiniaturesSection({
  locale,
  messages,
  miniatures,
}: {
  locale: Locale;
  messages: HomeMessages;
  miniatures: readonly Miniature[];
}) {
  return (
    <section
      className="latest-miniatures-domain relative isolate overflow-hidden bg-coal-950 py-24 sm:py-36"
      id="chapter-miniatures"
    >
      <Container className="max-w-[97.5rem]">
        <SectionIntro
          action={{
            href: localizedPath(locale, 'miniaturas'),
            label: messages.allMiniaturesCta,
          }}
          eyebrow={`${miniatures.length} ${messages.publicMiniatures}`}
          title={messages.latestMiniatures}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {miniatures.slice(0, 5).map((miniature, index) => (
            <Link
              className={`home-miniature-card group relative overflow-hidden bg-black ${
                index % 11 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
              href={localizedPath(locale, `miniaturas/${miniature.slug}`)}
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

function EditorialFeature({
  locale,
  messages,
}: {
  locale: Locale;
  messages: HomeMessages;
}) {
  const guardian = guardians[0];
  if (!guardian) return null;

  return (
    <section
      className="editorial-feature-domain relative isolate min-h-[70svh] overflow-hidden border-y border-stone-600/20"
      id="gallery"
    >
      <Image
        alt={`Destaque editorial: ${guardian.title}`}
        className="-z-20 object-cover object-[68%_center] opacity-60"
        fill
        sizes="100vw"
        src={guardian.media[0]?.url ?? '/images/home/asterheim-hero.webp'}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/10" />
      <Container className="flex min-h-[70svh] max-w-[97.5rem] items-center py-20">
        <div className="editorial-feature__content max-w-2xl">
          <Eyebrow>{messages.featuredGuardian}</Eyebrow>
          <h2 className="font-display mt-5 text-[clamp(3.2rem,7vw,6.5rem)] leading-[.88] uppercase">
            {guardian.title}
          </h2>
          <p className="text-parchment-200/72 mt-6 max-w-xl text-base leading-7">
            {guardian.description}
          </p>
          <Link
            className="text-aged-gold-500 mt-8 inline-flex gap-3 text-xs font-semibold tracking-[.18em] uppercase transition-transform hover:translate-x-1"
            href={localizedPath(locale, 'personagens')}
          >
            {messages.guardianCta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function ProjectClosing({
  locale,
  messages,
  miniature,
}: {
  locale: Locale;
  messages: HomeMessages;
  miniature: Miniature | undefined;
}) {
  return (
    <section
      className="project-closing-domain relative isolate min-h-[62svh] overflow-hidden border-y border-stone-600/20"
      id="editorial"
    >
      <Image
        alt={miniature?.cover?.alt ?? messages.imageFallbackAlt}
        className="-z-20 object-cover object-[70%_center] opacity-55"
        fill
        sizes="100vw"
        src={miniature?.cover?.src ?? '/images/home/asterheim-hero.webp'}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-transparent" />
      <Container className="flex min-h-[62svh] max-w-[97.5rem] items-center py-20">
        <div className="project-closing__content max-w-2xl">
          <Eyebrow>{messages.projectEyebrow}</Eyebrow>
          <h2 className="font-display mt-5 text-[clamp(3.2rem,7vw,6rem)] leading-[.88] uppercase">
            {messages.projectTitle}
          </h2>
          <p className="text-parchment-200/72 mt-6 max-w-xl text-base leading-7">
            {messages.projectBody}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <LinkButton
              href={`${localizedPath(locale)}#editorial`}
              size="lg"
              tone="gold"
            >
              {messages.projectCta}
            </LinkButton>
            <LinkButton href="/guia-de-impressao" size="lg">
              {messages.printingGuide}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

export async function LocalizedHomePage({ locale }: { locale: Locale }) {
  const messages = getHomeMessages(locale);
  const [
    localizedCollections,
    localizedMiniatures,
    defaultCollections,
    defaultMiniatures,
  ] = await Promise.all([
    getPublishedCollections(locale),
    getMiniatures(locale),
    getPublishedCollections('pt-br'),
    getMiniatures('pt-br'),
  ]);
  const collections = localizedCollections.length
    ? localizedCollections
    : defaultCollections;
  const miniatures = localizedMiniatures.length
    ? localizedMiniatures
    : defaultMiniatures;

  return (
    <div lang={locale === 'pt-br' ? 'pt-BR' : locale}>
      <SkipLink
        label={
          locale === 'pt-br'
            ? 'Pular para o conteúdo'
            : locale === 'es'
              ? 'Saltar al contenido'
              : 'Skip to content'
        }
      />
      <SiteHeader locale={locale} />
      <main id="main-content">
        <Hero messages={messages} />
        <AsterheimSection locale={locale} messages={messages} />
        <CollectionsSection
          collections={collections}
          locale={locale}
          messages={messages}
          miniatures={miniatures}
        />
        <MiniaturesSection
          locale={locale}
          messages={messages}
          miniatures={miniatures}
        />
        <EditorialFeature locale={locale} messages={messages} />
        <ProjectClosing
          locale={locale}
          messages={messages}
          miniature={miniatures.find((item) => item.featured)}
        />
      </main>
      <SiteFooter locale={locale} />
      <JsonLd data={getStructuredData(locale)} />
    </div>
  );
}

export default function RootPage() {
  redirect('/pt-br');
}

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  homeDomainArtwork,
  homeDomainOrder,
} from "@/content/home-domains";
import { crowns } from "@/content/heroic-entities";

const supportedLocales = ["pt-br", "en", "es"] as const;
type SupportedLocale = (typeof supportedLocales)[number];
type HomeDomainSlug = (typeof homeDomainOrder)[number];

type PageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  "pt-br": {
    eyebrow: "Arquivo Cartográfico Recuperado",
    title: "Atlas de Asterheim",
    intro:
      "Compilado a partir de fragmentos preservados pelos cartógrafos de Asterheim.",
    mapEyebrow: "O mundo conhecido",
    mapTitle: "Um continente. Seis domínios.",
    mapBody:
      "A cartografia completa de Asterheim permanece em restauração. Este fragmento reúne os domínios já registrados pelo Atlas.",
    restoration: "Registro cartográfico em restauração",
    domainsEyebrow: "Os grandes reinos",
    domainsTitle: "Terras moldadas por forças antigas",
    domainsBody:
      "Explore os seis domínios preservados nos registros de Asterheim.",
    explore: "Explorar reino",
    environment: "Ambiente",
    force: "Força da Coroa",
    record: "Registro",
    recorded: "Catalogado",
    exploreShort: "Explorar",
    dossier: "Dossiê do Reino",
    archive: "Arquivo",
    recovered: "Registro recuperado",
  },
  en: {
    eyebrow: "Recovered Cartographic Archive",
    title: "Atlas of Asterheim",
    intro:
      "Compiled from fragments preserved by the cartographers of Asterheim.",
    mapEyebrow: "The known world",
    mapTitle: "One continent. Six domains.",
    mapBody:
      "Asterheim’s complete cartography remains under restoration. This fragment gathers the domains already recorded by the Atlas.",
    restoration: "Cartographic record under restoration",
    domainsEyebrow: "The great kingdoms",
    domainsTitle: "Lands shaped by ancient forces",
    domainsBody: "Explore the six domains preserved in Asterheim’s records.",
    explore: "Explore kingdom",
    environment: "Environment",
    force: "Crown force",
    record: "Record",
    recorded: "Catalogued",
    exploreShort: "Explore",
    dossier: "Kingdom dossier",
    archive: "Archive",
    recovered: "Recovered record",
  },
  es: {
    eyebrow: "Archivo Cartográfico Recuperado",
    title: "Atlas de Asterheim",
    intro:
      "Compilado a partir de fragmentos preservados por los cartógrafos de Asterheim.",
    mapEyebrow: "El mundo conocido",
    mapTitle: "Un continente. Seis dominios.",
    mapBody:
      "La cartografía completa de Asterheim permanece en restauración. Este fragmento reúne los dominios ya registrados por el Atlas.",
    restoration: "Registro cartográfico en restauración",
    domainsEyebrow: "Los grandes reinos",
    domainsTitle: "Tierras moldeadas por fuerzas antiguas",
    domainsBody:
      "Explora los seis dominios preservados en los registros de Asterheim.",
    explore: "Explorar reino",
    environment: "Entorno",
    force: "Fuerza de la Corona",
    record: "Registro",
    recorded: "Catalogado",
    exploreShort: "Explorar",
    dossier: "Dossier del Reino",
    archive: "Archivo",
    recovered: "Registro recuperado",
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

const presentation = {
  "frost-kingdom": {
    signature: "The Kingdom of Ice",
    environment: "Glacial citadel",
    visual: "frost",
  },
  stormreach: {
    signature: "The Sea of Endless Storms",
    environment: "Storm coast",
    visual: "storm",
  },
  ironhold: {
    signature: "The Forge of a Thousand Fires",
    environment: "Volcanic forge",
    visual: "iron",
  },
  "elder-forest": {
    signature: "The Heart of the Ancients",
    environment: "Ancient woodland",
    visual: "forest",
  },
  "kingdom-of-the-abyss": {
    signature: "The Depths That Remember",
    environment: "Submerged abyss",
    visual: "abyss",
  },
  "scorched-wastes": {
    signature: "The Land Where Fires Never Die",
    environment: "Ashen badlands",
    visual: "scorched",
  },
} satisfies Record<
  HomeDomainSlug,
  { signature: string; environment: string; visual: string }
>;

const atlasFraming = {
  "frost-kingdom": {
    desktop: "center 30%",
    tablet: "center 28%",
    mobile: "center 24%",
  },
  stormreach: {
    desktop: "center 45%",
    tablet: "center 43%",
    mobile: "center 40%",
  },
  ironhold: {
    desktop: "center 48%",
    tablet: "center 46%",
    mobile: "center 44%",
  },
  "elder-forest": {
    desktop: "center 50%",
    tablet: "center 48%",
    mobile: "center 45%",
  },
  "kingdom-of-the-abyss": {
    desktop: "center 45%",
    tablet: "center 43%",
    mobile: "center 40%",
  },
  "scorched-wastes": {
    desktop: "center 48%",
    tablet: "center 46%",
    mobile: "center 43%",
  },
} satisfies Record<
  HomeDomainSlug,
  { desktop: string; tablet: string; mobile: string }
>;

type AtlasArtworkStyle = CSSProperties & {
  "--atlas-focus-desktop": string;
  "--atlas-focus-tablet": string;
  "--atlas-focus-mobile": string;
};

function resolveLocale(locale: string): SupportedLocale {
  if (!supportedLocales.includes(locale as SupportedLocale)) {
    notFound();
  }

  return locale as SupportedLocale;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = copy[locale];
  const path = `/${locale}/atlas/reinos`;

  return {
    title: `${messages.title} | The Black Banner`,
    description: messages.intro,
    alternates: {
      canonical: path,
      languages: {
        "pt-BR": "/pt-br/atlas/reinos",
        en: "/en/atlas/reinos",
        es: "/es/atlas/reinos",
        "x-default": "/pt-br/atlas/reinos",
      },
    },
    openGraph: {
      title: messages.title,
      description: messages.intro,
      url: path,
      images: ["/images/home/kingdoms-expanse.webp"],
    },
  };
}

export default async function AtlasKingdomsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = copy[locale];
  const crownByKingdom = new Map(
    crowns.map((crown) => [crown.kingdom.slug, crown]),
  );

  const kingdoms = homeDomainOrder.map((slug) => {
    const artwork = homeDomainArtwork[slug];
    const crown = crownByKingdom.get(slug);

    return {
      slug,
      artwork,
      crown,
      name: crown?.kingdom.title ?? slug,
      framing: atlasFraming[slug],
      ...presentation[slug],
    };
  });

  return (
    <main className="atlas-kingdoms-page">
      <section className="atlas-kingdoms-hero" aria-labelledby="atlas-title">
        <div className="atlas-kingdoms-hero__mosaic" aria-hidden="true">
          {kingdoms.map(({ slug, artwork, framing }) => (
            <div className="atlas-kingdoms-hero__panel" key={slug}>
              <Image
                src={artwork.image}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 50vw, 34vw"
                style={
                  {
                    "--atlas-focus-desktop": framing.desktop,
                    "--atlas-focus-tablet": framing.tablet,
                    "--atlas-focus-mobile": framing.mobile,
                  } as AtlasArtworkStyle
                }
              />
            </div>
          ))}
        </div>
        <div className="atlas-kingdoms-hero__grid" aria-hidden="true" />
        <div className="atlas-kingdoms-hero__compass" aria-hidden="true">
          <span>N</span>
        </div>
        <div className="atlas-kingdoms-hero__veil" />
        <div className="atlas-kingdoms-hero__content">
          <p className="atlas-kingdoms-eyebrow">{messages.eyebrow}</p>
          <h1 id="atlas-title">{messages.title}</h1>
          <p>{messages.intro}</p>
        </div>
        <span className="atlas-kingdoms-hero__line" aria-hidden="true" />
      </section>

      <section className="atlas-map-section" aria-labelledby="atlas-map-title">
        <header className="atlas-section-heading">
          <p className="atlas-kingdoms-eyebrow">{messages.mapEyebrow}</p>
          <h2 id="atlas-map-title">{messages.mapTitle}</h2>
          <p>{messages.mapBody}</p>
        </header>

        <div className="atlas-relic-map">
          <Image
            src="/images/home/kingdoms-expanse.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 92vw"
            className="atlas-relic-map__image"
          />
          <div className="atlas-relic-map__patina" />
          <svg
            className="atlas-relic-map__routes"
            viewBox="0 0 1200 700"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path d="M110 520C260 375 355 440 485 295S760 170 1090 245" />
            <path d="M195 175C380 230 425 135 610 215S890 535 1045 505" />
            <circle cx="600" cy="350" r="138" />
            <circle cx="600" cy="350" r="205" />
          </svg>
          <div className="atlas-relic-map__compass" aria-hidden="true">
            <span>N</span>
          </div>
          <p className="atlas-relic-map__status">{messages.restoration}</p>

          <nav
            className="atlas-relic-map__legend"
            aria-label={messages.domainsEyebrow}
          >
            {kingdoms.map(({ slug, name, signature }) => (
              <Link key={slug} href={`/${locale}/atlas/reinos/${slug}`}>
                <span className="atlas-relic-map__marker" aria-hidden="true" />
                <span className="atlas-relic-map__destination">
                  <strong>{name}</strong>
                  <small>{signature}</small>
                </span>
                <span className="atlas-relic-map__explore" aria-hidden="true">
                  {messages.exploreShort} →
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section
        className="atlas-domains-section"
        aria-labelledby="atlas-domains-title"
      >
        <header className="atlas-section-heading atlas-section-heading--domains">
          <p className="atlas-kingdoms-eyebrow">{messages.domainsEyebrow}</p>
          <h2 id="atlas-domains-title">{messages.domainsTitle}</h2>
          <p>{messages.domainsBody}</p>
        </header>

        <div className="atlas-domain-grid">
          {kingdoms.map(
            ({
              slug,
              artwork,
              crown,
              name,
              signature,
              environment,
              visual,
              framing,
            }) => (
              <article
                className="atlas-domain-cover"
                data-visual={visual}
                key={slug}
              >
                <Link
                  href={`/${locale}/atlas/reinos/${slug}`}
                  className="atlas-domain-cover__link"
                  aria-label={`${messages.explore}: ${name}`}
                >
                  <div className="atlas-domain-cover__art">
                    <Image
                      src={artwork.image}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      className="atlas-domain-cover__image"
                      style={
                        {
                          "--atlas-focus-desktop": framing.desktop,
                          "--atlas-focus-tablet": framing.tablet,
                          "--atlas-focus-mobile": framing.mobile,
                        } as AtlasArtworkStyle
                      }
                    />
                    <div className="atlas-domain-cover__overlay" />
                  </div>

                  <div className="atlas-domain-cover__content">
                    <header className="atlas-domain-cover__dossier-heading">
                      <div className="atlas-domain-cover__register">
                        <p>
                          <span aria-hidden="true">◇</span> {messages.dossier}
                        </p>
                        <p>
                          {messages.archive}{" "}
                          {String(homeDomainOrder.indexOf(slug) + 1).padStart(
                            2,
                            "0",
                          )}
                        </p>
                      </div>
                      <h3>
                        <span className="sr-only">{name}: </span>
                        {signature}
                      </h3>
                      <p className="atlas-domain-cover__record-state">
                        {messages.recovered}
                      </p>
                    </header>

                    <dl className="atlas-domain-cover__metadata">
                      <div>
                        <dt>{messages.environment}</dt>
                        <dd>{environment}</dd>
                      </div>
                      <div>
                        <dt>{messages.force}</dt>
                        <dd>{crown?.force ?? "—"}</dd>
                      </div>
                      <div>
                        <dt>{messages.record}</dt>
                        <dd>{messages.recorded}</dd>
                      </div>
                    </dl>

                    <span className="atlas-domain-cover__cta">
                      {messages.explore} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </article>
            ),
          )}
        </div>
      </section>
    </main>
  );
}

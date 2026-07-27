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
    eyebrow: "Cartografia dos Seis Domínios",
    title: "Atlas de Asterheim",
    intro:
      "Um mundo marcado por Coroas, fronteiras partidas e caminhos que ainda aguardam registro.",
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
  },
  en: {
    eyebrow: "Cartography of the Six Domains",
    title: "Atlas of Asterheim",
    intro:
      "A world marked by Crowns, fractured borders, and paths still waiting to be recorded.",
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
  },
  es: {
    eyebrow: "Cartografía de los Seis Dominios",
    title: "Atlas de Asterheim",
    intro:
      "Un mundo marcado por Coronas, fronteras fracturadas y caminos que aún esperan ser registrados.",
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
      ...presentation[slug],
    };
  });

  return (
    <main className="atlas-kingdoms-page">
      <section className="atlas-kingdoms-hero" aria-labelledby="atlas-title">
        <Image
          src="/images/home/kingdoms-expanse.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="atlas-kingdoms-hero__image"
        />
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
            {kingdoms.map(({ slug, name }) => (
              <Link key={slug} href={`/${locale}/atlas/reinos/${slug}`}>
                <span aria-hidden="true" />
                {name}
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
            ({ slug, artwork, crown, name, signature, environment, visual }) => (
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
                      className={`atlas-domain-cover__image atlas-domain-cover__image--${artwork.fit}`}
                      style={{ objectPosition: artwork.objectPosition }}
                    />
                    <div className="atlas-domain-cover__overlay" />
                  </div>

                  <div className="atlas-domain-cover__content">
                    <div>
                      <p className="atlas-domain-cover__index">
                        {String(homeDomainOrder.indexOf(slug) + 1).padStart(2, "0")}
                      </p>
                      <h3>{name}</h3>
                      <p className="atlas-domain-cover__signature">{signature}</p>
                    </div>

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

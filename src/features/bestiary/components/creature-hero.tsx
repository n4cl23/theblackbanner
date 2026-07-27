import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ResolvedCreatureHero } from "@/features/bestiary/data/creature-hero-presentation";

type CreatureHeroStyle = CSSProperties & {
  "--creature-focus-desktop": string;
  "--creature-focus-tablet": string;
  "--creature-focus-mobile": string;
  "--creature-title-width": string;
  "--creature-overlay": number;
};

export function CreatureHero({
  title,
  classification,
  threatLevel,
  category,
  documentationStatus,
  hero,
}: {
  title: string;
  classification: string;
  threatLevel: string;
  category: string;
  documentationStatus: string;
  hero: ResolvedCreatureHero;
}) {
  const style = {
    "--creature-focus-desktop": hero.focalPoint.desktop,
    "--creature-focus-tablet": hero.focalPoint.tablet,
    "--creature-focus-mobile": hero.focalPoint.mobile,
    "--creature-title-width": hero.titleMaxWidth,
    "--creature-overlay": hero.overlayIntensity,
  } as CreatureHeroStyle;

  return (
    <section
      className="creature-hero-v2"
      data-align={hero.contentAlign}
      data-asset-layout={hero.assetLayout}
      data-height={hero.height}
      data-title-scale={hero.titleScale}
      style={style}
      aria-labelledby="creature-title"
    >
      <div className="creature-hero-v2__media">
        <Image
          alt=""
          aria-hidden="true"
          className="creature-hero-v2__backdrop"
          fill
          priority
          sizes="100vw"
          src={hero.asset.src}
        />
        <Image
          alt={hero.asset.alt}
          className="creature-hero-v2__art"
          fill
          priority
          sizes="100vw"
          src={hero.asset.src}
        />
      </div>

      <div className="creature-hero-v2__atmosphere" aria-hidden="true" />
      <div className="creature-hero-v2__grain" aria-hidden="true" />

      <div className="creature-hero-v2__layout">
        <div className="creature-hero-v2__content">
          <nav aria-label="Breadcrumb" className="creature-hero-v2__breadcrumb">
            <Link href="/bestiario">Bestiário</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <p className="creature-hero-v2__eyebrow">
            {category} <span aria-hidden="true">·</span>{" "}
            {documentationStatus}
          </p>
          <h1 id="creature-title">{title}</h1>
          <p className="creature-hero-v2__classification">
            {classification} <span aria-hidden="true">·</span> ameaça{" "}
            {threatLevel}
          </p>
        </div>
      </div>

      <p className="creature-hero-v2__record" aria-hidden="true">
        Bestiary record · {hero.asset.dedicated ? "Hero archive" : "Field plate"}
      </p>
    </section>
  );
}

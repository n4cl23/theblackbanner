import { getAsterheimMedia } from "@/content/asterheim-media-manifest";

export type CreatureHeroAlignment = "left" | "right";
export type CreatureHeroHeight = "standard" | "tall" | "monumental";
export type CreatureHeroTitleScale = "display" | "standard" | "compact";

export type CreatureHeroOverride = {
  focalPoint: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  titleMaxWidth: string;
  titleScale?: CreatureHeroTitleScale;
  overlayIntensity: number;
  height: CreatureHeroHeight;
  contentAlign: CreatureHeroAlignment;
  heroAsset?: string;
};

export type CreatureHeroAsset = {
  src: string;
  width: number | null;
  height: number | null;
  alt: string;
  dedicated: boolean;
};

export type ResolvedCreatureHero = CreatureHeroOverride & {
  asset: CreatureHeroAsset;
  assetLayout: "panoramic" | "portrait";
  titleScale: CreatureHeroTitleScale;
};

const defaultHero: CreatureHeroOverride = {
  focalPoint: {
    desktop: "72% 46%",
    tablet: "68% 44%",
    mobile: "50% 34%",
  },
  titleMaxWidth: "min(45vw, 46rem)",
  overlayIntensity: 0.7,
  height: "tall",
  contentAlign: "left",
};

/**
 * Presentation-only overrides. They do not alter canonical creature content
 * and can later be supplied by the editorial adapter or CMS.
 */
export const creatureHeroOverrides: Readonly<
  Record<string, Partial<CreatureHeroOverride>>
> = {
  "fenrir-the-moon-devourer": {
    focalPoint: {
      desktop: "74% 48%",
      tablet: "68% 45%",
      mobile: "50% 37%",
    },
    titleMaxWidth: "min(42vw, 42rem)",
    titleScale: "compact",
    overlayIntensity: 0.76,
    height: "monumental",
  },
  "lightning-serpent": {
    focalPoint: {
      desktop: "72% 46%",
      tablet: "68% 43%",
      mobile: "50% 35%",
    },
    titleMaxWidth: "min(40vw, 38rem)",
    overlayIntensity: 0.68,
    height: "tall",
  },
  "aegis-the-first-sky-king": {
    focalPoint: {
      desktop: "68% 42%",
      tablet: "64% 40%",
      mobile: "52% 35%",
    },
    titleMaxWidth: "min(42vw, 42rem)",
    titleScale: "compact",
    overlayIntensity: 0.66,
    height: "monumental",
  },
  "abyss-jelly": {
    focalPoint: {
      desktop: "68% 48%",
      tablet: "64% 46%",
      mobile: "50% 40%",
    },
    overlayIntensity: 0.72,
  },
  "the-white-dragon": {
    focalPoint: {
      desktop: "70% 42%",
      tablet: "66% 40%",
      mobile: "50% 34%",
    },
    titleMaxWidth: "min(41vw, 40rem)",
    overlayIntensity: 0.74,
    height: "monumental",
  },
};

export function resolveCreatureHero({
  slug,
  title,
  fallbackImage,
}: {
  slug: string;
  title: string;
  fallbackImage: string;
}): ResolvedCreatureHero {
  const override = creatureHeroOverrides[slug] ?? {};
  const config: CreatureHeroOverride = {
    ...defaultHero,
    ...override,
    focalPoint: {
      ...defaultHero.focalPoint,
      ...override.focalPoint,
    },
  };
  const media = getAsterheimMedia(slug).filter(
    (item) => item.type === "image" && item.status !== "archived",
  );
  const dedicatedCandidates = media
    .filter((item) => item.usage === "hero")
    .sort(
      (left, right) =>
        (right.width ?? 0) * (right.height ?? 0) -
        (left.width ?? 0) * (left.height ?? 0),
    );
  const fallbackCandidate = media.find((item) => item.usage === "gallery");
  const selected =
    dedicatedCandidates.find((item) => item.src === config.heroAsset) ??
    dedicatedCandidates[0] ??
    fallbackCandidate;
  const asset: CreatureHeroAsset = selected
    ? {
        src: selected.src,
        width: selected.width,
        height: selected.height,
        alt: selected.alt,
        dedicated: selected.usage === "hero",
      }
    : {
        src: fallbackImage,
        width: null,
        height: null,
        alt: `Registro visual de ${title}`,
        dedicated: false,
      };
  const ratio =
    asset.width && asset.height ? asset.width / asset.height : null;

  return {
    ...config,
    asset,
    assetLayout:
      asset.dedicated || (ratio !== null && ratio >= 1.45)
        ? "panoramic"
        : "portrait",
    titleScale: config.titleScale ?? resolveTitleScale(title),
  };
}

export function resolveTitleScale(title: string): CreatureHeroTitleScale {
  const length = Array.from(title.trim()).length;
  if (length <= 16) return "display";
  if (length <= 28) return "standard";
  return "compact";
}

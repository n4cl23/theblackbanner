import { describe, expect, it } from "vitest";

import {
  resolveCreatureHero,
  resolveTitleScale,
} from "@/features/bestiary/data/creature-hero-presentation";

describe("creature hero presentation", () => {
  it("adapts title scale to the title length", () => {
    expect(resolveTitleScale("Fenrir")).toBe("display");
    expect(resolveTitleScale("Lightning Serpent")).toBe("standard");
    expect(resolveTitleScale("Aegis, the First Sky King")).toBe("standard");
    expect(
      resolveTitleScale("The Last Devourer Beneath the Forgotten Mountain"),
    ).toBe("compact");
  });

  it("uses a dedicated panoramic asset when the media archive provides one", () => {
    const hero = resolveCreatureHero({
      slug: "abyss-jelly",
      title: "Abyss Jelly",
      fallbackImage: "/images/fallbacks/creature.svg",
    });

    expect(hero.asset.dedicated).toBe(true);
    expect(hero.assetLayout).toBe("panoramic");
    expect(hero.asset.src).not.toBe("/images/fallbacks/creature.svg");
  });

  it("preserves non-panoramic art with the portrait composition", () => {
    const hero = resolveCreatureHero({
      slug: "fenrir-the-moon-devourer",
      title: "Fenrir, the Moon Devourer",
      fallbackImage: "/images/fallbacks/creature.svg",
    });

    expect(hero.assetLayout).toBe("portrait");
    expect(hero.height).toBe("monumental");
    expect(hero.focalPoint.desktop).toBe("74% 48%");
    expect(hero.titleMaxWidth).toBe("min(42vw, 42rem)");
  });
});

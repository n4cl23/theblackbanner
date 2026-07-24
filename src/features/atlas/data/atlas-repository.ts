import { cache } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import { getKingdomPresentation } from '@/features/world/data/world-presentation.mock';
import { getBiomePresentation } from '@/features/bestiary/data/bestiary-presentation.mock';
import {
  atlasRegionSchema,
  atlasSchema,
} from '@/features/atlas/domain/atlas-schema';

export const getAtlas = cache(async () =>
  atlasSchema.parse({
    id: 'asterheim',
    locale: 'pt-br',
    kingdomSlugs: (await getAtlasKingdoms()).map((x) => x.slug),
    regionSlugs: (await getAtlasRegions()).map((x) => x.slug),
    layers: [
      'borders',
      'kingdoms',
      'regions',
      'ruins',
      'danger-zones',
      'creatures',
      'historical-events',
    ],
  }),
);
export const getAtlasKingdoms = cache(async () =>
  (await getContentRepository()).getKingdoms(),
);
export const getAtlasKingdomBySlug = cache(async (slug: string) =>
  (await getContentRepository()).getKingdomBySlug(slug),
);
export const getAtlasCreatures = cache(async () =>
  (await getContentRepository()).getCreatures(),
);
export const getAtlasPointsOfInterest = cache(async () =>
  (await getContentRepository()).getLocations(),
);
export const getAtlasLayers = cache(async () => (await getAtlas()).layers);
export const getAtlasRegions = cache(async () => {
  const repo = await getContentRepository();
  const [regions, kingdoms, creatures, locations, events] = await Promise.all([
    repo.getRegions(),
    repo.getKingdoms(),
    repo.getCreatures(),
    repo.getLocations(),
    repo.getTimelineEvents(),
  ]);
  return regions.map((region) => {
    const kingdom = kingdoms.find((x) => x.id === region.kingdomId)!;
    const localCreatures = creatures.filter((x) =>
      x.regionIds.includes(region.id),
    );
    const localLocations = locations.filter((x) => x.regionId === region.id);
    const presentation = getKingdomPresentation(kingdom.slug)!;
    const biome = getBiomePresentation(kingdom.slug)!;
    const danger = localCreatures.some((x) => x.threatLevel === 'extreme')
      ? 'extreme'
      : localCreatures.some((x) => x.threatLevel === 'severe')
        ? 'severe'
        : 'unknown';
    return atlasRegionSchema.parse({
      id: region.id,
      slug: region.slug,
      title: region.title,
      kingdomSlug: kingdom.slug,
      description: region.description,
      climate: region.climate,
      biome: {
        id: `biome-${region.slug}`,
        title: biome.biome,
        climate: region.climate,
      },
      dangerLevel: danger,
      dominantSpecies: localCreatures.map((x) => x.title),
      creatures: localCreatures.map((x) => x.slug),
      locations: localLocations.map((x) => x.slug),
      landmarks: localLocations.map((x) => x.title),
      historicalEvents: events
        .filter((e) =>
          e.entityRefs.some(
            (ref) =>
              ref.id === kingdom.id ||
              localLocations.some((l) => l.id === ref.id),
          ),
        )
        .map((e) => e.slug),
      mapCoordinates:
        localLocations.find((x) => x.coordinates)?.coordinates ?? null,
      media: presentation.landscape,
      status: 'published',
      locale: 'pt-br',
    });
  });
});
export const getAtlasRegionBySlug = cache(
  async (slug: string) =>
    (await getAtlasRegions()).find((x) => x.slug === slug) ?? null,
);

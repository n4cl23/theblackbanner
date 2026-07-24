import { cache } from 'react';
import { getContentRepository } from '@/features/content/repository/repository';
import {
  chronicles,
  narrativeRelations,
  timelinePresentations,
} from './lore.mock';
import { mockMiniatures } from '@/features/collections/data/collections.mock';
import { getAtlasRegions } from '@/features/atlas/data/atlas-repository';

export interface SearchRecord {
  id: string;
  title: string;
  type: string;
  href: string;
  excerpt: string;
  image: string;
  locale: 'pt-br';
}

export const getTimelineData = cache(async () => {
  const repository = await getContentRepository();
  const [events, kingdoms, characters, creatures, factions] = await Promise.all(
    [
      repository.getTimelineEvents(),
      repository.getKingdoms(),
      repository.getCharacters(),
      repository.getCreatures(),
      repository.getFactions(),
    ],
  );
  const presentations = new Map<string, (typeof timelinePresentations)[number]>(
    timelinePresentations.map((item) => [item.eventId, item]),
  );
  return {
    events: events.map((event) => ({
      event,
      presentation: presentations.get(event.id)!,
    })),
    kingdoms,
    characters,
    creatures,
    factions,
  };
});

export const getLoreIndexData = cache(async () => {
  const repository = await getContentRepository();
  const [
    articles,
    characters,
    creatures,
    kingdoms,
    events,
    collections,
    atlasRegions,
  ] = await Promise.all([
    repository.getLoreArticles(),
    repository.getCharacters(),
    repository.getCreatures(),
    repository.getKingdoms(),
    repository.getTimelineEvents(),
    repository.getCollections(),
    getAtlasRegions(),
  ]);
  const searchRecords: SearchRecord[] = [
    ...atlasRegions.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Região',
      href: `/pt-br/atlas/regioes/${item.slug}`,
      excerpt: item.description,
      image: '/images/home/asterheim-hero.webp',
      locale: 'pt-br' as const,
    })),
    ...mockMiniatures.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Miniatura',
      href: `/pt-br/miniaturas/${item.slug}`,
      excerpt: item.excerpt,
      image: item.cover.src,
      locale: 'pt-br' as const,
    })),
    ...characters.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Personagem',
      href: `/pt-br/personagens/${item.slug}`,
      excerpt: item.excerpt,
      image: '/images/home/asterheim-hero.webp',
      locale: 'pt-br' as const,
    })),
    ...creatures.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Criatura',
      href: `/pt-br/bestiario/${item.slug}`,
      excerpt: item.excerpt,
      image: '/images/home/bestiary-ruins.webp',
      locale: 'pt-br' as const,
    })),
    ...kingdoms.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Reino',
      href: `/pt-br/world/kingdoms/${item.slug}`,
      excerpt: item.excerpt,
      image: '/images/home/kingdoms-expanse.webp',
      locale: 'pt-br' as const,
    })),
    ...events.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Evento',
      href: `/pt-br/timeline#${item.id}`,
      excerpt: item.excerpt,
      image: '/images/home/asterheim-hero.webp',
      locale: 'pt-br' as const,
    })),
    ...articles.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Artigo',
      href: `/pt-br/lore/${item.slug}`,
      excerpt: item.excerpt,
      image: '/images/home/bestiary-ruins.webp',
      locale: 'pt-br' as const,
    })),
    ...collections.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Coleção',
      href: `/pt-br/colecoes/${item.slug}`,
      excerpt: item.excerpt,
      image: '/images/home/kingdoms-expanse.webp',
      locale: 'pt-br' as const,
    })),
    ...chronicles.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Crônica',
      href: `/pt-br/chronicles/${item.slug}`,
      excerpt: item.excerpt,
      image: '/images/home/asterheim-hero.webp',
      locale: 'pt-br' as const,
    })),
  ];
  return { articles, searchRecords, relations: narrativeRelations };
});

export const getLoreArticleData = cache(async (slug: string) => {
  const repository = await getContentRepository();
  const [article, characters, creatures, kingdoms, locations, articles] =
    await Promise.all([
      repository.getLoreArticleBySlug(slug),
      repository.getCharacters(),
      repository.getCreatures(),
      repository.getKingdoms(),
      repository.getLocations(),
      repository.getLoreArticles(),
    ]);
  if (!article) return null;
  const entities = [...characters, ...creatures, ...kingdoms, ...locations];
  return {
    article,
    mentioned: article.citedEntityRefs.flatMap((ref) =>
      entities.filter((item) => item.id === ref.id),
    ),
    related: articles.filter((item) => item.id !== article.id).slice(0, 1),
  };
});

export { chronicles, narrativeRelations };

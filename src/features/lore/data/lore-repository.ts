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
    })),
    ...mockMiniatures.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Miniatura',
      href: `/pt-br/miniaturas/${item.slug}`,
      excerpt: item.excerpt,
    })),
    ...characters.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Personagem',
      href: `/personagens/${item.slug}`,
      excerpt: item.excerpt,
    })),
    ...creatures.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Criatura',
      href: `/bestiario/${item.slug}`,
      excerpt: item.excerpt,
    })),
    ...kingdoms.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Reino',
      href: `/world/kingdoms/${item.slug}`,
      excerpt: item.excerpt,
    })),
    ...events.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Evento',
      href: `/timeline#${item.id}`,
      excerpt: item.excerpt,
    })),
    ...articles.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Artigo',
      href: `/lore/${item.slug}`,
      excerpt: item.excerpt,
    })),
    ...collections.map((item) => ({
      id: item.id,
      title: item.title,
      type: 'Coleção',
      href: `/colecoes/${item.slug}`,
      excerpt: item.excerpt,
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

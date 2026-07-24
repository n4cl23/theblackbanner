import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChronicleReader } from '@/features/lore/components/chronicle-reader';
import { NarrativeRelations } from '@/features/lore/components/narrative-relations';
import {
  TimelineExplorer,
  type TimelineRecord,
} from '@/features/lore/components/timeline-explorer';
import { UnifiedSearch } from '@/features/lore/components/unified-search';
import {
  getLoreArticleData,
  getLoreIndexData,
  getTimelineData,
} from '@/features/lore/data/lore-repository';
import {
  chronicles,
  narrativeRelations,
  timelinePresentations,
} from '@/features/lore/data/lore.mock';
import {
  chronicleSchema,
  narrativeRelationSchema,
  timelinePresentationSchema,
} from '@/features/lore/domain/lore-schema';
const replace = vi.fn();
const storage = new Map<string, string>();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/timeline',
  useSearchParams: () => new URLSearchParams(),
}));

const records: TimelineRecord[] = [
  {
    id: 'first',
    title: 'First',
    excerpt: 'Opening',
    dateLabel: 'Old',
    era: 'Ash',
    year: 2,
    impact: 'regional',
    conflict: 'Road',
    kingdoms: ['Reach'],
    characters: ['Watcher'],
    creatures: [],
    factions: ['Watch'],
    related: [],
  },
  {
    id: 'second',
    title: 'Second',
    excerpt: 'Later',
    dateLabel: 'New',
    era: 'Iron',
    year: 8,
    impact: 'continental',
    conflict: 'Banner',
    kingdoms: ['March'],
    characters: ['Bearer'],
    creatures: ['Stalker'],
    factions: [],
    related: [{ id: 'first', title: 'First' }],
  },
];

describe('connected lore', () => {
  it('indexes every supported editorial type with locale, media and route', async () => {
    const { searchRecords } = await getLoreIndexData();
    expect(new Set(searchRecords.map((record) => record.type))).toEqual(
      new Set([
        'Região',
        'Personagem',
        'Criatura',
        'Reino',
        'Evento',
        'Artigo',
        'Crônica',
        'Coleção',
      ]),
    );
    expect(
      searchRecords.every(
        (record) =>
          record.locale === 'pt-br' &&
          record.image.startsWith('/') &&
          record.href.startsWith('/pt-br/'),
      ),
    ).toBe(true);
  });
  beforeEach(() => {
    replace.mockClear();
    storage.clear();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
        clear: () => storage.clear(),
      },
    });
  });
  it('validates and orders temporal presentation', async () => {
    timelinePresentations.forEach((item) =>
      expect(timelinePresentationSchema.safeParse(item).success).toBe(true),
    );
    const data = await getTimelineData();
    expect(data.events.map(({ event }) => event.chronologyOrder)).toEqual([
      10, 20, 30, 40, 50,
    ]);
  });
  it('synchronizes timeline views and filters with the URL', () => {
    render(<TimelineExplorer records={records} />);
    fireEvent.change(screen.getByLabelText('Visão da timeline'), {
      target: { value: 'kingdom' },
    });
    expect(replace).toHaveBeenCalledWith('/timeline?visao=kingdom', {
      scroll: false,
    });
  });
  it('validates and renders navigable relationships', () => {
    narrativeRelations.forEach((item) =>
      expect(narrativeRelationSchema.safeParse(item).success).toBe(true),
    );
    render(<NarrativeRelations relations={narrativeRelations} />);
    expect(screen.getAllByRole('link').length).toBe(
      narrativeRelations.length * 2,
    );
  });
  it('searches all supported local entity families', async () => {
    const { searchRecords } = await getLoreIndexData();
    expect(new Set(searchRecords.map((item) => item.type))).toEqual(
      new Set([
        'Personagem',
        'Criatura',
        'Reino',
        'Evento',
        'Artigo',
        'Coleção',
        'Região',
        'Crônica',
      ]),
    );
    render(<UnifiedSearch records={searchRecords} />);
    fireEvent.change(screen.getByLabelText('Buscar em Asterheim'), {
      target: { value: 'Watcher' },
    });
    await screen.findAllByRole('link', { name: /The Far Watcher/i });
    expect(
      document.querySelector(
        'a[href="/pt-br/personagens/character-far-watcher"]',
      ),
    ).toBeInTheDocument();
  });
  it('navigates chronicle chapters by controls and keyboard and stores progress', () => {
    const chronicle = chronicleSchema.parse(chronicles[0]);
    render(<ChronicleReader chronicle={chronicle} />);
    fireEvent.click(screen.getByRole('button', { name: /Próximo capítulo/i }));
    expect(
      screen.getByRole('heading', { name: chronicle.chapters[1]!.title }),
    ).toBeVisible();
    expect(
      window.localStorage.getItem(
        `asterheim:chronicle:${chronicle.slug}:chapter:v1`,
      ),
    ).toBe('1');
    fireEvent.keyDown(screen.getByText(/Use ← e →/).parentElement!, {
      key: 'ArrowLeft',
    });
    expect(
      screen.getByRole('heading', { name: chronicle.chapters[0]!.title }),
    ).toBeVisible();
  });
  it('resolves lore URLs and invalid slugs', async () => {
    await expect(
      getLoreArticleData('article-roads-and-ruins'),
    ).resolves.toMatchObject({ article: { title: 'Roads and Ruins' } });
    await expect(getLoreArticleData('missing')).resolves.toBeNull();
  });
});

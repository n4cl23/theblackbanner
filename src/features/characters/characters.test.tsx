import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CharacterExplorer,
  type ExplorerCharacter,
} from '@/features/characters/components/character-explorer';
import { EditorialMedia } from '@/features/characters/components/editorial-media';
import { generateMetadata as characterMetadata } from '@/app/(archives)/personagens/[slug]/page';
import { generateMetadata as guardianMetadata } from '@/app/(archives)/guardioes/[slug]/page';
import {
  getCharacterPageData,
  getGuardianPageData,
} from '@/features/characters/data/character-repository';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/personagens',
  useSearchParams: () => new URLSearchParams(),
}));
const records: ExplorerCharacter[] = [
  {
    id: '1',
    slug: 'one',
    title: 'Far Watcher',
    role: 'Scout',
    kingdomId: 'k1',
    factionIds: ['f1'],
    epithet: 'Watcher',
    treatment: 'principal',
    image: '/images/home/asterheim-hero.webp',
    order: 0,
  },
  {
    id: '2',
    slug: 'two',
    title: 'Veil Keeper',
    role: 'Archivist',
    kingdomId: 'k2',
    factionIds: ['f2'],
    epithet: 'Keeper',
    treatment: 'antagonista',
    image: '/images/home/bestiary-ruins.webp',
    order: 1,
  },
];
describe('character archive', () => {
  beforeEach(() => replace.mockClear());
  it('synchronizes search and filters with the URL', () => {
    render(
      <CharacterExplorer
        characters={records}
        factions={[{ value: 'f1', label: 'Faction' }]}
        kingdoms={[{ value: 'k1', label: 'Kingdom' }]}
      />,
    );
    fireEvent.change(screen.getByLabelText('Buscar personagens'), {
      target: { value: 'Far' },
    });
    expect(replace).toHaveBeenCalledWith('/personagens?q=Far', {
      scroll: false,
    });
    fireEvent.change(screen.getByLabelText('Reino'), {
      target: { value: 'k1' },
    });
    expect(replace).toHaveBeenCalledWith('/personagens?reino=k1', {
      scroll: false,
    });
  });
  it('offers all required filter dimensions and sorting', () => {
    render(
      <CharacterExplorer characters={records} factions={[]} kingdoms={[]} />,
    );
    expect(screen.getByLabelText('Facção')).toBeInTheDocument();
    expect(screen.getByLabelText('Função')).toBeInTheDocument();
    expect(screen.getByLabelText('Ordenação')).toBeInTheDocument();
  });
  it('resolves dynamic records and missing slugs', async () => {
    await expect(
      getCharacterPageData('character-far-watcher'),
    ).resolves.toMatchObject({
      character: { title: 'The Far Watcher' },
      relationships: [{ kind: 'ally' }, { kind: 'hunts' }],
    });
    await expect(getCharacterPageData('missing')).resolves.toBeNull();
    await expect(
      getGuardianPageData('guardian-black-gate'),
    ).resolves.toMatchObject({
      guardian: { title: 'Guardian of the Black Gate' },
    });
  });

  it('renders media credits and replaces failed images with a fallback', () => {
    render(
      <EditorialMedia
        alt="Character study"
        caption="Mock caption"
        credit="Mock credit"
        image="/missing.webp"
      />,
    );
    fireEvent.error(screen.getByRole('img', { name: 'Character study' }));
    expect(screen.getByText('Mídia indisponível')).toBeVisible();
    expect(screen.getByText('Crédito: Mock credit')).toBeVisible();
  });
  it('blocks demo character metadata and builds canonical guardian metadata', async () => {
    await expect(
      characterMetadata({
        params: Promise.resolve({ slug: 'character-far-watcher' }),
      }),
    ).resolves.toMatchObject({
      title: 'Personagem não encontrado',
      robots: { index: false },
    });
    await expect(
      guardianMetadata({
        params: Promise.resolve({ slug: 'king-aldric' }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: '/guardioes/king-aldric' },
      openGraph: { type: 'profile' },
    });
  });
});

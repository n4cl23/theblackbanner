import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateStaticParams as atlasParams } from '@/app/(bestiary)/atlas/[kingdom]/page';
import { generateMetadata as creatureMetadata } from '@/app/(bestiary)/bestiario/[slug]/page';
import {
  BestiaryExplorer,
  type BestiaryRecord,
} from '@/features/bestiary/components/bestiary-explorer';
import { FieldGallery } from '@/features/bestiary/components/field-gallery';
import { creaturePresentations } from '@/features/bestiary/data/bestiary-presentation.mock';
import {
  getAtlasPageData,
  getCreaturePageData,
} from '@/features/bestiary/data/bestiary-repository';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/bestiario',
  useSearchParams: () => new URLSearchParams(),
}));
const records: BestiaryRecord[] = [
  {
    id: '1',
    slug: 'fog',
    title: 'Fog Stalker',
    classification: 'Predator',
    threatLevel: 'severe',
    kingdomIds: ['k1'],
    habitatIds: ['h1'],
    category: 'Predador',
    size: 'Grande',
    behaviorType: 'Caçador',
    rarity: 'rare',
    documentationStatus: 'observed',
    image: '/images/home/bestiary-ruins.webp',
  },
];

describe('bestiary and atlas', () => {
  beforeEach(() => replace.mockClear());
  it('offers all eight filters and synchronizes changes with the URL', () => {
    render(
      <BestiaryExplorer
        records={records}
        kingdoms={[{ value: 'k1', label: 'Kingdom' }]}
        habitats={[{ value: 'h1', label: 'Habitat' }]}
      />,
    );
    for (const label of [
      'Reino',
      'Habitat',
      'Categoria',
      'Nível de ameaça',
      'Tamanho',
      'Comportamento',
      'Raridade',
      'Documentação',
    ])
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Reino'), {
      target: { value: 'k1' },
    });
    expect(replace).toHaveBeenCalledWith('/bestiario?reino=k1', {
      scroll: false,
    });
  });
  it('keeps taxonomy and repository relationships consistent', async () => {
    expect(
      creaturePresentations.every((item) => item.taxonomy.length === 3),
    ).toBe(true);
    await expect(
      getCreaturePageData('creature-fog-stalker'),
    ).resolves.toMatchObject({
      creature: { threatLevel: 'severe' },
      relationships: [{ kind: 'hunts' }],
    });
    await expect(getCreaturePageData('missing')).resolves.toBeNull();
  });
  it('keeps demo Atlas routes out of static generation', async () => {
    await expect(atlasParams()).resolves.toHaveLength(0);
    await expect(getAtlasPageData('kingdom-iron-march')).resolves.toMatchObject(
      { biome: { biome: 'Tempestade e ferro' } },
    );
    await expect(getAtlasPageData('missing')).resolves.toBeNull();
  });
  it('creates dynamic creature metadata', async () => {
    await expect(
      creatureMetadata({
        params: Promise.resolve({ slug: 'creature-ash-hound' }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: '/bestiario/creature-ash-hound' },
    });
  });
  it('opens, navigates, zooms, closes the lightbox, and falls back on media error', () => {
    const items = creaturePresentations[0]!.evidence;
    render(<FieldGallery items={items} />);
    fireEvent.click(
      screen.getAllByRole('button', { name: /Abrir evidência/ })[0]!,
    );
    expect(
      screen.getByRole('dialog', { name: 'Visualizador de evidência' }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Ampliar evidência' }));
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByText(items[1]!.caption)).toBeVisible();
    const images = screen.getAllByRole('img', { name: items[1]!.caption });
    fireEvent.error(images.at(-1)!);
    expect(screen.getByText('Evidência indisponível')).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

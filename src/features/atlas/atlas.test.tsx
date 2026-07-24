import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AtlasMap } from '@/features/atlas/components/atlas-map';
import { atlasRegionSchema } from '@/features/atlas/domain/atlas-schema';
import {
  getAtlas,
  getAtlasCreatures,
  getAtlasKingdoms,
  getAtlasRegionBySlug,
  getAtlasRegions,
} from '@/features/atlas/data/atlas-repository';
import { kingdomPresentations } from '@/features/world/data/world-presentation.mock';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => '/pt-br/atlas/mapa',
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Atlas de Asterheim', () => {
  it('validates the Atlas without duplicating canonical entities', async () => {
    const [atlas, kingdoms, regions, creatures] = await Promise.all([
      getAtlas(),
      getAtlasKingdoms(),
      getAtlasRegions(),
      getAtlasCreatures(),
    ]);
    expect(atlas.kingdomSlugs).toHaveLength(3);
    expect(kingdoms).toHaveLength(3);
    expect(regions).toHaveLength(3);
    expect(creatures).toHaveLength(4);
    regions.forEach((region) =>
      expect(atlasRegionSchema.safeParse(region).success).toBe(true),
    );
    await expect(getAtlasRegionBySlug('missing')).resolves.toBeNull();
  });
  it('supports layers, zoom, keyboard and an accessible list fallback', async () => {
    const [records, regions] = await Promise.all([
      getAtlasKingdoms(),
      getAtlasRegions(),
    ]);
    const kingdoms = records.map((k) => ({
      ...kingdomPresentations.find((p) => p.slug === k.slug)!,
      title: k.title,
      sigil: k.sigil,
    }));
    render(<AtlasMap kingdoms={kingdoms} locale="pt-br" regions={regions} />);
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar zoom' }));
    fireEvent.keyDown(
      screen.getByLabelText('Territórios e regiões navegáveis de Asterheim'),
      { key: 'ArrowRight' },
    );
    fireEvent.click(screen.getByLabelText('Ruínas'));
    fireEvent.click(
      screen
        .getAllByRole('button', { name: /Campos de Cinza/ })
        .find((element) => element.tagName === 'BUTTON')!,
    );
    expect(replace).toHaveBeenCalledWith(
      expect.stringContaining('regiao=region-ashen-reach'),
      { scroll: false },
    );
    expect(
      screen.getByRole('heading', { name: 'Alternativa acessível' }),
    ).toBeVisible();
  });
});

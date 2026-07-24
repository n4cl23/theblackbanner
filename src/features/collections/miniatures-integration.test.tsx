import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MiniatureExplorer } from '@/features/collections/components/miniature-explorer';
import { mockMiniatures } from '@/features/collections/data/collections.mock';
import {
  getFeaturedMiniatures,
  getMiniatureBySlug,
  getMiniatureFilters,
  getMiniatures,
  getMiniaturesByCollection,
  getMiniaturesByEntity,
} from '@/features/collections/data/miniature-repository';
import { miniatureSchema } from '@/features/collections/domain/miniature-schema';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/pt-br/miniaturas',
  useSearchParams: () => new URLSearchParams(),
}));

describe('localized miniature integration', () => {
  beforeEach(() => replace.mockClear());

  it('validates complete records and keeps private assets absent', () => {
    expect(mockMiniatures).toHaveLength(4);
    for (const item of mockMiniatures) {
      expect(miniatureSchema.safeParse(item).success).toBe(true);
      expect(item.cover.alt).toBeTruthy();
      expect(item).not.toHaveProperty('privateFileUrl');
      expect(item.model3d).toBeNull();
      expect(item.video).toBeNull();
    }
  });

  it('provides the complete repository contract', async () => {
    await expect(getMiniatures()).resolves.toHaveLength(4);
    await expect(getMiniatures('en')).resolves.toHaveLength(0);
    await expect(getMiniatureBySlug('far-watcher-32mm')).resolves.toMatchObject(
      { featured: true },
    );
    await expect(getFeaturedMiniatures()).resolves.toHaveLength(1);
    await expect(
      getMiniaturesByCollection('collection-beasts'),
    ).resolves.toHaveLength(2);
    await expect(
      getMiniaturesByEntity('creature-ash-hound'),
    ).resolves.toHaveLength(1);
    await expect(getMiniatureFilters()).resolves.toMatchObject({
      scales: expect.arrayContaining(['32 mm', '54 mm', '75 mm']),
    });
  });

  it('renders cards and synchronizes search and filters with the URL', async () => {
    const filters = await getMiniatureFilters();
    render(
      <MiniatureExplorer
        filters={filters}
        locale="pt-br"
        records={mockMiniatures}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('4 miniaturas');
    expect(
      screen.getByRole('link', { name: /The Far Watcher/i }),
    ).toHaveAttribute('href', '/pt-br/miniaturas/far-watcher-32mm');
    fireEvent.change(screen.getByLabelText('Buscar miniaturas'), {
      target: { value: 'Watcher' },
    });
    expect(replace).toHaveBeenCalledWith('/pt-br/miniaturas?q=Watcher', {
      scroll: false,
    });
    fireEvent.change(screen.getByLabelText('Escala'), {
      target: { value: '32 mm' },
    });
    expect(replace).toHaveBeenCalledWith('/pt-br/miniaturas?escala=32+mm', {
      scroll: false,
    });
  });
});

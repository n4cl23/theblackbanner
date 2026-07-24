import fs from 'node:fs';
import path from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MiniatureExplorer } from '@/features/collections/components/miniature-explorer';
import {
  getAllMiniatures,
  getAllRealCollections,
  getMiniatureFilters,
  getMiniatures,
} from '@/features/collections/data/miniature-repository';
import { miniatureSchema } from '@/features/collections/domain/miniature-schema';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/pt-br/miniaturas',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Sprint 22 real miniature catalog', () => {
  beforeEach(() => replace.mockClear());

  it('loads 192 real records and publishes only the approved batch', async () => {
    const records = await getAllMiniatures();
    expect(records).toHaveLength(192);
    expect(
      records.every((item) => miniatureSchema.safeParse(item).success),
    ).toBe(true);
    expect(records.filter((item) => item.status === 'published')).toHaveLength(
      14,
    );
    expect(records.filter((item) => item.status === 'review')).toHaveLength(4);
    expect(records.filter((item) => item.status === 'draft')).toHaveLength(174);
    expect(records.map((item) => item.slug)).not.toEqual(
      expect.arrayContaining([
        'far-watcher-32mm',
        'banner-bearer-75mm',
        'fog-stalker-54mm',
        'ash-hound-32mm',
      ]),
    );
  });

  it('exposes exactly the approved Portuguese batch', async () => {
    await expect(getMiniatures()).resolves.toHaveLength(14);
    await expect(getMiniatures('en')).resolves.toHaveLength(0);
    await expect(getMiniatureFilters()).resolves.toEqual({
      collections: ['beasts-of-asterheim', 'the-black-banner-company'],
      entityTypes: ['character', 'creature'],
      scales: [],
      difficulties: [],
      statuses: ['published'],
    });
  });

  it('keeps conflicts, incomplete media and unapproved records hidden', async () => {
    const published = await getMiniatures();
    const hidden = [
      'demon-fogo',
      'the-kraken-caller-legends-of-the-realm',
      'the-kraken-caller-the-six-crowns-of-asterheim',
      'the-last-dragon-slayer-legends-of-the-realm',
      'the-last-dragon-slayer-the-six-crowns-of-asterheim',
    ];
    expect(published.map((item) => item.slug)).not.toEqual(
      expect.arrayContaining(hidden),
    );
  });

  it('maps thirteen real collections without promoting them', async () => {
    const collections = await getAllRealCollections();
    expect(collections).toHaveLength(13);
    expect(collections.every((item) => item.status === 'draft')).toBe(true);
    expect(collections.map((item) => item.title)).toEqual(
      expect.arrayContaining([
        'The Black Banner Company',
        'The Broken Mug Tavern',
        'Iron Tankard Tavern',
        'Legends of the Realm',
        'Beasts of Asterheim',
        'The Six Crowns of Asterheim',
      ]),
    );
  });

  it('keeps all public media valid and exposes no local or private paths', async () => {
    const records = await getAllMiniatures();
    const serialized = JSON.stringify(records);
    expect(serialized).not.toMatch(/[A-Z]:\\/);
    expect(serialized).not.toMatch(/\.stl\b/i);
    expect(serialized).not.toMatch(/\.glb\b/i);
    expect(records.filter((item) => item.cover)).toHaveLength(191);
    for (const record of records) {
      for (const media of [
        ...(record.cover ? [record.cover] : []),
        ...record.gallery,
      ]) {
        expect(
          fs.existsSync(path.join(process.cwd(), 'public', media.src)),
        ).toBe(true);
      }
    }
  });

  it('renders the real grid into initial markup and synchronizes filters', async () => {
    const records = (await getMiniatures()).slice(0, 4);
    const firstRecord = records[0];
    expect(firstRecord).toBeDefined();
    if (!firstRecord) throw new Error('Expected at least one real miniature');
    const filters = {
      collections: [...new Set(records.map((item) => item.collectionSlug))],
      entityTypes: [...new Set(records.map((item) => item.entityType))],
      scales: [],
      difficulties: [],
      statuses: ['published'] as const,
    };
    render(
      <MiniatureExplorer filters={filters} locale="pt-br" records={records} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('4 miniaturas');
    expect(screen.getAllByRole('link')).toHaveLength(4);
    fireEvent.change(screen.getByLabelText('Buscar miniaturas'), {
      target: { value: firstRecord.title },
    });
    expect(replace).toHaveBeenCalledWith(
      `/pt-br/miniaturas?q=${encodeURIComponent(firstRecord.title).replace(/%20/g, '+')}`,
      { scroll: false },
    );
  });

  it('contains no STL anywhere under public', () => {
    const publicFiles = fs.readdirSync(path.join(process.cwd(), 'public'), {
      recursive: true,
    });
    expect(publicFiles.some((file) => /\.stl$/i.test(String(file)))).toBe(
      false,
    );
  });
});

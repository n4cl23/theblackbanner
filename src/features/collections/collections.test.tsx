import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMetadata as collectionMetadata } from '@/app/(collections)/colecoes/[slug]/page';
import {
  generateMetadata as miniatureMetadata,
  generateStaticParams as miniatureParams,
} from '@/app/(collections)/miniaturas/[slug]/page';
import { CollectionExplorer } from '@/features/collections/components/collection-explorer';
import { LockedDownload } from '@/features/collections/components/locked-download';
import { ModelInspectorContract } from '@/features/bestiary/components/model-inspector-contract';
import {
  collectionCategories,
  mockMiniatures,
} from '@/features/collections/data/collections.mock';
import {
  getCollectionPageData,
  getMiniaturePageData,
} from '@/features/collections/data/collection-repository';
import { miniatureSchema } from '@/features/collections/domain/miniature-schema';
const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/colecoes',
  useSearchParams: () => new URLSearchParams(),
}));
describe('collections and miniatures', () => {
  beforeEach(() => replace.mockClear());
  it('supports every requested collection category and URL filters', () => {
    expect(collectionCategories).toEqual(
      expect.arrayContaining([
        'characters',
        'creatures',
        'bosses',
        'taverns',
        'mercenaries',
        'guardians',
        'factions',
        'thematic',
      ]),
    );
    render(
      <CollectionExplorer
        categories={collectionCategories}
        records={[
          {
            id: '1',
            slug: 'one',
            title: 'One',
            category: 'characters',
            banner: '/images/home/asterheim-hero.webp',
            identity: 'Mock',
            itemCount: 2,
          },
        ]}
      />,
    );
    fireEvent.change(screen.getByLabelText('Categoria da coleção'), {
      target: { value: 'characters' },
    });
    expect(replace).toHaveBeenCalledWith('/colecoes?categoria=characters', {
      scroll: false,
    });
  });
  it('validates all technical miniature records without private URLs', () => {
    for (const item of mockMiniatures) {
      expect(miniatureSchema.safeParse(item).success).toBe(true);
      expect(item).not.toHaveProperty('privateFileUrl');
      expect(item.includedFileDescriptors.length).toBeGreaterThan(0);
    }
  });
  it('resolves collection and miniature routes and invalid slugs', async () => {
    await expect(
      getCollectionPageData('collection-vanguard'),
    ).resolves.toMatchObject({ miniatures: { length: 2 } });
    await expect(getCollectionPageData('missing')).resolves.toBeNull();
    await expect(
      getMiniaturePageData('fog-stalker-54mm'),
    ).resolves.toMatchObject({ miniature: { pieceCount: 5 } });
    await expect(getMiniaturePageData('missing')).resolves.toBeNull();
    expect(miniatureParams()).toEqual([{ slug: 'ash-hound-32mm' }]);
  });
  it('creates dynamic metadata', async () => {
    await expect(
      collectionMetadata({
        params: Promise.resolve({ slug: 'collection-beasts' }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: '/colecoes/collection-beasts' },
    });
    await expect(
      miniatureMetadata({
        params: Promise.resolve({ slug: 'ash-hound-32mm' }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: '/miniaturas/ash-hound-32mm' },
    });
  });
  it('keeps downloads demonstrative and exposes no URL', () => {
    render(<LockedDownload descriptors={['Body', 'Base']} version="0.1.0" />);
    const button = screen.getByRole('button', { name: 'Download bloqueado' });
    expect(button).not.toHaveAttribute('href');
    fireEvent.click(button);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Nenhum arquivo privado',
    );
    expect(document.querySelector('a')).toBeNull();
  });
  it('shows the lightweight 3D fallback while no GLB exists', () => {
    render(<ModelInspectorContract asset={null} label="Mock miniature" />);
    expect(screen.getByText(/GLB/i)).toBeInTheDocument();
  });
});

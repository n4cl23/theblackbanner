import { describe, expect, it } from 'vitest';
import {
  generateMetadata,
  generateStaticParams,
} from '@/app/world/kingdoms/[slug]/page';
import { getKingdomPageData } from '@/features/world/data/world-repository';

describe('world routes', () => {
  it('does not generate public routes for demo kingdoms', async () => {
    await expect(generateStaticParams()).resolves.toHaveLength(0);
  });

  it('rejects an unknown kingdom slug at the data boundary', async () => {
    await expect(getKingdomPageData('unknown-kingdom')).resolves.toBeNull();
  });

  it('creates dynamic kingdom metadata with canonical and Open Graph data', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'kingdom-ashen-reach' }),
    });
    expect(metadata.alternates).toEqual({
      canonical: '/world/kingdoms/kingdom-ashen-reach',
    });
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      title: 'The Ashen Reach',
    });
  });
});

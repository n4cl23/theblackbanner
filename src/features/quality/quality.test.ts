import nextConfig from '../../../next.config';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { GET as getRss } from '@/app/rss.xml/route';
import { siteConfig } from '@/config/site';

describe('quality foundation', () => {
  it('publishes indexable robots rules while excluding internal routes', () => {
    const value = robots();
    expect(value.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    expect(value.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          allow: '/',
          disallow: ['/admin/', '/design-system'],
        }),
      ]),
    );
  });

  it('provides localized canonical alternatives and sitemap priorities', () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(20);
    expect(entries.every((entry) => entry.url.startsWith(siteConfig.url))).toBe(
      true,
    );
    expect(entries[0]?.alternates?.languages).toHaveProperty('x-default');
    expect(entries.some((entry) => entry.priority === 1)).toBe(true);
  });

  it('serves a valid RSS document with cache policy', async () => {
    const response = await getRss();
    const xml = await response.text();
    expect(response.headers.get('content-type')).toContain(
      'application/rss+xml',
    );
    expect(response.headers.get('cache-control')).toContain('s-maxage=3600');
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain(`<title>${siteConfig.name}</title>`);
  });

  it('configures defensive headers and permanent legacy redirects', async () => {
    const headers = await nextConfig.headers?.();
    const globalHeaders = headers?.find((entry) => entry.source === '/(.*)');
    const names = new Set(globalHeaders?.headers.map(({ key }) => key));
    expect(names.size).toBeGreaterThanOrEqual(8);
    for (const name of [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]) {
      expect(names.has(name)).toBe(true);
    }
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: '/reinos', permanent: true }),
      ]),
    );
  });
});

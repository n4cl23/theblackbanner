import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const principalRoutes = [
  '/',
  '/pt-br',
  '/world/kingdoms',
  '/bestiario',
  '/lore',
];

for (const route of principalRoutes) {
  test(`has no serious accessibility violations on ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(({ impact }) =>
        ['serious', 'critical'].includes(impact ?? ''),
      ),
    ).toEqual([]);
  });
}

test('exposes crawl directives, feeds, metadata, and defensive headers', async ({
  page,
  request,
}) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  expect(response?.headers()['content-security-policy']).toContain(
    "frame-ancestors 'none'",
  );
  expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  await expect(page).toHaveTitle(/The Black Banner/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /^https:\/\/the-black-banner-v2\.vercel\.app\/?$/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

  const robotsResponse = await request.get('/robots.txt');
  expect(robotsResponse.status()).toBe(200);
  expect(await robotsResponse.text()).toContain('Disallow: /admin/');
  const sitemapResponse = await request.get('/sitemap.xml');
  expect(sitemapResponse.status()).toBe(200);
  expect(await sitemapResponse.text()).toContain('hreflang="x-default"');
  const rssResponse = await request.get('/rss.xml');
  expect(rssResponse.status()).toBe(200);
  expect(rssResponse.headers()['content-type']).toContain(
    'application/rss+xml',
  );
});

test('returns correct 404 and redirect status codes', async ({
  page,
  request,
}) => {
  const missing = await page.goto('/arquivo-que-nao-existe');
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Além do mapa' }),
  ).toBeVisible();
  const redirect = await request.get('/reinos', { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers()['location']).toBe('/world/kingdoms');
});

test('supports keyboard focus and contains no broken internal links on Home', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: /skip to content/i }),
  ).toBeFocused();
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => link.getAttribute('href')).filter(Boolean),
      ),
    ]);
  for (const href of hrefs) {
    const response = await request.get(href as string);
    expect(response.status(), `broken internal link: ${href}`).toBeLessThan(
      400,
    );
  }
});

test('respects reduced motion and keeps images described', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const motionDuration = await page
    .locator('.section-reveal')
    .first()
    .evaluate((element) => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(motionDuration)).toBeLessThanOrEqual(0.00001);
  expect(await page.locator('img:not([alt])').count()).toBe(0);
});

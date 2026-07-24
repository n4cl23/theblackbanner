import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/personagens',
  '/bestiario',
  '/pt-br/atlas',
  '/colecoes',
  '/pt-br/miniaturas',
  '/world/kingdoms',
];

for (const viewport of [
  { name: 'mobile-320', width: 320, height: 720 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'ultrawide', width: 1920, height: 1080 },
]) {
  test(`keeps primary public pages visually stable at ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main').last()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(
        overflow,
        `${route} must not overflow at ${viewport.width}px`,
      ).toBe(false);
    }

    await page.goto('/bestiario');
    await expect(
      page.getByRole('heading', { name: /Aquilo que observa de volta/i }),
    ).toBeVisible();
    await page.screenshot({
      animations: 'disabled',
      fullPage: true,
      path: testInfo.outputPath(`${viewport.name}-bestiary.png`),
    });
  });
}

test('exposes active navigation state on desktop and mobile', async ({
  page,
}) => {
  await page.goto('/bestiario');
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', {
        name: 'Bestiário',
        exact: true,
      }),
  ).toHaveAttribute('aria-current', 'page');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Bestiário', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

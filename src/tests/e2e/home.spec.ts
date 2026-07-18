import { expect, test } from '@playwright/test';

test('renders the cinematic Home on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'The Black Banner' }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Entrar em Asterheim' }).click();
  await expect(page.locator('#asterheim')).toBeInViewport();
  await expect(
    page.getByRole('heading', { name: 'Galeria de atmosferas' }),
  ).toBeAttached();
});

test('supports mobile navigation and all Home sections', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const mobileNavigation = page.getByRole('navigation', {
    name: 'Mobile navigation',
  });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole('link', { name: 'Bestiário' }).click();
  await expect(page.locator('#bestiary')).toBeInViewport();
  await expect(mobileNavigation).not.toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeAttached();
});

test('keeps the internal design system available', async ({ page }) => {
  await page.goto('/design-system');
  await expect(
    page.getByRole('heading', { name: 'Asterheim', exact: true }),
  ).toBeVisible();
});

test('explores kingdoms and the accessible map', async ({ page }) => {
  await page.goto('/world/kingdoms');
  await expect(
    page.getByRole('heading', { name: /três reinos/i }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: /abrir crônica territorial/i })
    .first()
    .click();
  await expect(
    page.getByRole('heading', { name: 'The Ashen Reach', level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Timeline local')).toBeVisible();

  await page.goto('/world/map');
  await page
    .getByRole('button', { name: 'Selecionar na lista: The Iron March' })
    .click();
  await expect(
    page.getByRole('link', { name: /abrir arquivo/i }),
  ).toHaveAttribute('href', /kingdom-iron-march/);
});

test('uses the accessible list as the mobile map fallback', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/world/map');
  await expect(page.getByLabel('Mapa interativo de Asterheim')).toBeHidden();
  await expect(page.getByText('Legenda e alternativa acessível')).toBeVisible();
});

test('filters characters through URL state and opens a rich profile', async ({
  page,
}) => {
  await page.goto('/personagens');
  await page.getByLabel('Buscar personagens').fill('Watcher');
  await expect(page).toHaveURL(/q=Watcher/);
  await page.getByRole('link', { name: /The Far Watcher/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Personalidade' }),
  ).toBeVisible();
  await expect(page.getByText('Conflitos internos')).toBeVisible();
  await expect(page.getByText(/Crédito:/)).toBeVisible();
});

test('renders the monumental guardian experience', async ({ page }) => {
  await page.goto('/guardioes');
  await page.getByRole('link', { name: /Guardian of the Black Gate/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Guardian of the Black Gate', level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Vínculo com as Coroas')).toBeVisible();
  await expect(page.getByText('Relíquia')).toBeVisible();
});

test('keeps character filters and profile content usable on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personagens');
  await expect(page.getByLabel('Reino')).toBeVisible();
  await page.getByRole('link', { name: /The Far Watcher/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Personalidade' }),
  ).toBeVisible();
});

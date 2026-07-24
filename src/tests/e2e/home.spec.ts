import { expect, test } from '@playwright/test';

test('renders the cinematic Home and canonical collections', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'The Black Banner', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeVisible();
  await expect(page.getByText('Vanguard Studies')).toHaveCount(0);
});

test('keeps demo kingdoms out of the public archive', async ({ page }) => {
  await page.goto('/world/kingdoms');
  await expect(
    page.getByRole('heading', { name: 'Reinos de Asterheim' }),
  ).toBeVisible();
  await expect(page.getByText(/aguardam revisão humana/i)).toBeVisible();
  const response = await page.goto('/world/kingdoms/kingdom-ashen-reach');
  expect(response?.status()).toBe(404);
});

test('keeps demo characters out of the public archive', async ({ page }) => {
  await page.goto('/personagens');
  await expect(page.getByText(/42 registros identificados/i)).toBeVisible();
  const response = await page.goto('/personagens/character-far-watcher');
  expect(response?.status()).toBe(404);
});

test('keeps demo creatures and atlas kingdoms unpublished', async ({ page }) => {
  await page.goto('/bestiario');
  await expect(page.getByText(/aguardam revisão humana/i)).toBeVisible();
  const creature = await page.goto('/bestiario/creature-fog-stalker');
  expect(creature?.status()).toBe(404);
  const atlas = await page.goto('/atlas/kingdom-iron-march');
  expect(atlas?.status()).toBe(404);
});

test('renders canonical collections with editorial status', async ({ page }) => {
  await page.goto('/colecoes');
  await expect(page.getByText('Vanguard Studies')).toHaveCount(0);
  await expect(page.getByText(/Em revisão|Rascunho/).first()).toBeVisible();
});

test('server-renders localized miniature content without suspense placeholder', async ({
  page,
}) => {
  await page.goto('/pt-br/miniaturas');
  await expect(
    page.getByRole('heading', { name: 'Miniaturas de Asterheim' }),
  ).toBeVisible();
  await expect(page.getByText('Organizando miniaturas…')).toHaveCount(0);
});

test('does not silently fall back for untranslated miniatures', async ({
  page,
}) => {
  await page.goto('/en/miniaturas');
  await expect(
    page.getByRole('heading', {
      name: 'Miniatures unavailable in this language',
    }),
  ).toBeVisible();
});

test('keeps demo miniature and its STL surface unpublished', async ({ page }) => {
  const response = await page.goto('/miniaturas/far-watcher-32mm');
  expect(response?.status()).toBe(404);
});

test('keeps the internal design system available', async ({ page }) => {
  await page.goto('/design-system');
  await expect(
    page.getByRole('heading', { name: 'Asterheim', exact: true }),
  ).toBeVisible();
});

test('renders six canonical guardians with bidirectional crown links', async ({
  page,
}) => {
  await page.goto('/guardioes');
  await expect(page.locator('main ol > li')).toHaveCount(6);
  await page.getByRole('link', { name: /King Aldric/i }).click();
  await expect(
    page.getByRole('heading', { name: 'King Aldric', level: 1 }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Coroa vinculada/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Iron Crown', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Guardião vinculado/i }),
  ).toHaveAttribute('href', '/guardioes/king-aldric');
});

test('renders the localized crown archive and explicit translation state', async ({
  page,
}) => {
  await page.goto('/pt-br/coroas');
  await expect(page.locator('main ol > li')).toHaveCount(6);
  await expect(
    page.getByRole('heading', { name: 'Coroas de Asterheim' }),
  ).toBeVisible();
  await page.goto('/en/coroas');
  await expect(
    page.getByRole('heading', {
      name: 'Crowns unavailable in this language',
    }),
  ).toBeVisible();
});

test('keeps character validation controls usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personagens');
  await expect(page.getByLabel('Buscar personagens')).toBeVisible();
  await expect(page.getByLabel('Coleção')).toBeVisible();
  await expect(page.getByLabel('Escala')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('0 registros aprovados');
  const response = await page.goto('/personagens/black-fang-mercenary');
  expect(response?.status()).toBe(404);
});

test('protects the administrative CMS', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/admin\/sign-in|admin/);
});

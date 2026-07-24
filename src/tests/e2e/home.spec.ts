import { expect, test } from '@playwright/test';

test('renders the cinematic Home and canonical collections', async ({
  page,
}) => {
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

test('keeps demo creatures and atlas kingdoms unpublished', async ({
  page,
}) => {
  await page.goto('/bestiario');
  await expect(page.getByText(/aguardam revisão humana/i)).toBeVisible();
  const creature = await page.goto('/bestiario/creature-fog-stalker');
  expect(creature?.status()).toBe(404);
  const atlas = await page.goto('/atlas/kingdom-iron-march');
  expect(atlas?.status()).toBe(404);
});

test('renders canonical collections with editorial status', async ({
  page,
}) => {
  await page.goto('/colecoes');
  await expect(page.getByText('Vanguard Studies')).toHaveCount(0);
  await expect(page.getByText(/Nenhuma coleção publicada/i)).toBeVisible();
  await expect(page.getByText(/Treze coleções reais/i)).toBeVisible();
});

test('server-renders localized miniature content without suspense placeholder', async ({
  page,
}) => {
  const response = await page.goto('/pt-br/miniaturas');
  const html = await response?.text();
  await expect(
    page.getByRole('heading', { name: 'Miniaturas de Asterheim' }),
  ).toBeVisible();
  await expect(page.getByText('Organizando miniaturas…')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText(
    '14 miniaturas encontradas',
  );
  expect(html).toContain('Black Fang Mercenary');
  expect(html).toContain('Obsidian Colossus');
  await expect(page.locator('main a[href*="/miniaturas/"]')).toHaveCount(14);
  await expect(page.getByText('Demon Fire')).toHaveCount(0);
  await expect(page.getByText('The Kraken Caller')).toHaveCount(0);
  await expect(page.getByText('The Last Dragon Slayer')).toHaveCount(0);
});

test('filters and searches the curated miniature batch on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/pt-br/miniaturas');
  await page.getByLabel('Buscar miniaturas').fill('Iron Wyrm');
  await expect(page.getByRole('status')).toContainText('1 miniaturas');
  await expect(page.getByRole('link', { name: /Iron Wyrm/i })).toBeVisible();
  await page.getByLabel('Coleção').selectOption('the-black-banner-company');
  await expect(page.getByRole('status')).toContainText('0 miniaturas');
});

test('renders all approved miniature detail pages without private assets', async ({
  page,
}) => {
  const slugs = [
    'black-fang-mercenary',
    'durgan-blacksmith',
    'iron-bull',
    'iron-wyrm',
    'forge-sentinel',
    'molten-guardian',
    'crystal-ram',
    'iron-boar',
    'ash-wolf',
    'rock-burrower',
    'tunnel-reaper',
    'ore-leech',
    'ember-tick',
    'obsidian-colossus',
  ];
  for (const slug of slugs) {
    const response = await page.goto(`/pt-br/miniaturas/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('a[href$=".stl"], a[href$=".glb"]')).toHaveCount(
      0,
    );
    await expect(page.getByText(/não documentado/i)).toHaveCount(0);
  }
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

test('keeps demo miniature and its STL surface unpublished', async ({
  page,
}) => {
  await page.goto('/miniaturas/far-watcher-32mm');
  await expect(page.getByText(/Erro 404 · caminho perdido/i)).toBeVisible();
  await expect(page.locator('a[href$=".stl"]')).toHaveCount(0);
});

test('returns HTTP 404 for curated miniature records that remain hidden', async ({
  page,
}) => {
  for (const slug of [
    'demon-fogo',
    'the-kraken-caller-legends-of-the-realm',
    'the-last-dragon-slayer-legends-of-the-realm',
  ]) {
    const response = await page.goto(`/pt-br/miniaturas/${slug}`);
    expect(response?.status()).toBe(404);
  }
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

test('keeps character validation controls usable on mobile', async ({
  page,
}) => {
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

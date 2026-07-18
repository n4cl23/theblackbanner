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

test('filters the codex and inspects creature field evidence', async ({
  page,
}) => {
  await page.goto('/bestiario');
  await page.getByLabel('Nível de ameaça').selectOption('severe');
  await expect(page).toHaveURL(/ameaca=severe/);
  await page.getByRole('link', { name: /The Fog Stalker/i }).click();
  await expect(page.getByRole('heading', { name: 'Taxonomia' })).toBeVisible();
  await page
    .getByRole('button', { name: /Abrir evidência/ })
    .first()
    .click();
  await expect(
    page.getByRole('dialog', { name: 'Visualizador de evidência' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Fechar galeria' }),
  ).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByText('Estudo ambiental associado ao habitat.'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('connects Atlas biomes to kingdoms and endemic species', async ({
  page,
}) => {
  await page.goto('/atlas');
  await page.getByRole('link', { name: /Tempestade e ferro/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Tempestade e ferro', level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Espécie dominante')).toBeVisible();
  await expect(
    page.getByRole('link', { name: /The Fog Stalker/i }),
  ).toBeVisible();
});

test('keeps the bestiary and Atlas usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/bestiario');
  await expect(page.getByLabel('Documentação')).toBeVisible();
  await page.goto('/atlas/kingdom-veiled-crown');
  await expect(
    page.getByRole('heading', {
      name: 'Floresta ancestral e abismo',
      level: 1,
    }),
  ).toBeVisible();
});

test('filters collections and opens a miniature technical sheet', async ({
  page,
}) => {
  await page.goto('/colecoes');
  await page.getByLabel('Categoria da coleção').selectOption('characters');
  await expect(page).toHaveURL(/categoria=characters/);
  await expect(page.getByText('1 coleções encontradas')).toBeVisible();
  await page.getByRole('link', { name: /Vanguard/i }).click();
  await expect(page.getByRole('heading', { name: 'Miniaturas' })).toBeVisible();
  await page.getByRole('link', { name: /Far Watcher/i }).click();
  await expect(
    page.getByRole('heading', { name: 'Especificações' }),
  ).toBeVisible();
  await expect(page.getByText('Impressora alvo')).toBeVisible();
});

test('keeps STL delivery locked without exposing a direct link', async ({
  page,
}) => {
  await page.goto('/miniaturas/far-watcher-32mm');
  await expect(page.getByRole('link', { name: /download/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Download bloqueado' }).click();
  await expect(
    page.getByText('Nenhum arquivo privado ou URL direta existe nesta sprint.'),
  ).toBeVisible();
  await expect(page.getByText(/checkout|pagamento/i)).toHaveCount(0);
});

test('renders the printing guide on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/guia-de-impressao');
  await expect(
    page.getByRole('heading', { name: /Da resina à relíquia/i, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Segurança', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Troubleshooting', { exact: true }),
  ).toBeVisible();
});

test('changes timeline views and follows related events', async ({ page }) => {
  await page.goto('/timeline');
  await expect(page.getByText('5 eventos documentados')).toBeVisible();
  await page.getByLabel('Visão da timeline').selectOption('conflict');
  await expect(page).toHaveURL(/visao=conflict/);
  await page.getByLabel('Filtro da timeline').selectOption('A Marcha Partida');
  await expect(page).toHaveURL(/filtro=A(\+|%20)Marcha(\+|%20)Partida/);
  await expect(page.getByText('2 eventos documentados')).toBeVisible();
  await page.getByRole('link', { name: 'The Crown Vanishes' }).click();
  await expect(page.locator('#event-crown-vanishes')).toBeInViewport();
});

test('searches connected lore and opens an article', async ({ page }) => {
  await page.goto('/lore');
  await page.getByLabel('Buscar em Asterheim').fill('Watcher');
  await expect(page.getByText('1 resultados')).toBeVisible();
  await expect(
    page.getByRole('link', { name: /The Far Watcher/i }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Roads and Ruins/i }).click();
  await expect(page.getByRole('navigation', { name: 'Sumário' })).toBeVisible();
  await expect(page.getByText('Entidades mencionadas')).toBeVisible();
});

test('reads chronicles with keyboard navigation and a local marker', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/chronicles/the-black-road');
  await expect(
    page.getByRole('heading', { name: 'Antes das cinzas' }),
  ).toBeVisible();
  await page.getByRole('region', { name: 'Leitor de crônica' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('heading', { name: 'O marco sem nome' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'O marco sem nome' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Capítulo anterior/i }),
  ).toBeVisible();
});

import { expect, test } from '@playwright/test';

test('opens the complete mobile navigation and closes it with Escape', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();

  const navigation = page.getByRole('navigation', {
    name: 'Mobile navigation',
  });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Atlas' })).toHaveAttribute(
    'href',
    '/pt-br/atlas',
  );
  await expect(
    navigation.getByRole('link', { name: 'Miniaturas' }),
  ).toHaveAttribute('href', '/pt-br/miniaturas');
  await expect(
    navigation.getByRole('link', { name: 'Guardiões' }),
  ).toHaveAttribute('href', '/guardioes');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(navigation).not.toBeVisible();
});

test('navigates to Atlas from the mobile menu', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Atlas' })
    .click();
  await expect(page).toHaveURL(/\/pt-br\/atlas$/);
  await expect(
    page.getByRole('heading', { name: 'Atlas de Asterheim' }),
  ).toBeVisible();
});

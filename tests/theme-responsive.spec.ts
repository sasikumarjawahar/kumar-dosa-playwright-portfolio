import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('toggles dark theme and preserves the preference after reload', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Toggle dark theme' });
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');

  await toggle.click();
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
  await page.reload();

  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Toggle dark theme' })).toHaveText('☀️');
});

test('keeps menu and ordering controls usable on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByRole('heading', { name: 'Dosa, your way' })).toBeVisible();
  await expect(page.locator('.menu-item')).toHaveCount(5);
  await expect(page.getByLabel('Your name')).toBeVisible();
  await expect(page.locator('#place-order-btn')).toBeVisible();

  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(375);
});

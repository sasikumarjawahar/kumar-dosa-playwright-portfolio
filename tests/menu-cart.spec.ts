import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows five dosa options with descriptive, loaded photos', async ({ page }) => {
  const menuItems = page.locator('.menu-item');
  await expect(menuItems).toHaveCount(5);
  await expect(menuItems.locator('h3')).toHaveText([
    'Classic Masala Dosa',
    'Mysore Masala Dosa',
    'Rava Dosa',
    'Paneer Dosa',
    'Ghee Roast Dosa',
  ]);

  const photos = menuItems.locator('img');
  await expect(photos).toHaveCount(5);
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute('alt', /dosa/i);
    await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  }
});

test('updates item quantities, cart count, and rupee total', async ({ page }) => {
  const masala = page.locator('.menu-item').filter({ has: page.getByRole('heading', { name: 'Classic Masala Dosa' }) });
  const mysore = page.locator('.menu-item').filter({ has: page.getByRole('heading', { name: 'Mysore Masala Dosa' }) });

  await masala.getByRole('button', { name: '+' }).click();
  await masala.getByRole('button', { name: '+' }).click();
  await mysore.getByRole('button', { name: '+' }).click();

  await expect(page.locator('#total-items')).toHaveText('3');
  await expect(page.locator('#cart-total')).toHaveText('₹570');
  await expect(page.locator('#place-order-btn')).toBeDisabled();
});

test('does not allow a quantity to drop below zero', async ({ page }) => {
  const firstItem = page.locator('.menu-item').first();
  await firstItem.getByRole('button', { name: '−' }).click();

  await expect(firstItem.locator('.quantity-display')).toHaveText('0');
  await expect(page.locator('#total-items')).toHaveText('0');
  await expect(page.locator('.empty-cart')).toBeVisible();
});

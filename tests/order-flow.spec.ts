import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function addClassicDosaAndName(page: import('@playwright/test').Page, name = 'Sasi Test') {
  await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
  await page.getByLabel('Your name').fill(name);
}

test('requires both a menu item and a customer name before ordering', async ({ page }) => {
  const placeOrder = page.getByRole('button', { name: /place my order/i });
  await expect(placeOrder).toBeDisabled();

  await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
  await expect(placeOrder).toBeDisabled();

  await page.locator('.menu-item').first().getByRole('button', { name: '−' }).click();
  await page.getByLabel('Your name').fill('Sasi Test');
  await expect(placeOrder).toBeDisabled();
});

test('places an order, shows a receipt, and resets the cart', async ({ page }) => {
  await addClassicDosaAndName(page);
  await page.getByRole('button', { name: /place my order/i }).click();

  await expect(page.locator('#notification')).toContainText('Order placed successfully!');
  const orderId = await page.locator('#order-id').inputValue();
  expect(orderId).toMatch(/^DH-\d{8}$/);
  await expect(page.locator('#order-details')).toContainText('Sasi Test');
  await expect(page.locator('#order-details')).toContainText('₹180');
  await expect(page.locator('#total-items')).toHaveText('0');
  await expect(page.locator('.empty-cart')).toBeVisible();
  await expect(page.getByLabel('Your name')).toHaveValue('');
});

test('looks up an existing order and reports an unknown order', async ({ page }) => {
  await addClassicDosaAndName(page, 'Lookup Test');
  await page.getByRole('button', { name: /place my order/i }).click();
  await expect(page.locator('#notification')).toContainText('Order placed successfully!');
  const orderId = await page.locator('#order-id').inputValue();

  await page.getByRole('button', { name: 'Look up' }).click();
  await expect(page.locator('#order-details')).toContainText(orderId);
  await expect(page.locator('#order-details')).toContainText('Lookup Test');

  await page.getByLabel('Order ID').fill('DH-00000000');
  await page.getByRole('button', { name: 'Look up' }).click();
  await expect(page.locator('#notification')).toContainText('Order not found');
});

test('renders customer-provided markup as text in the receipt', async ({ page }) => {
  const customerName = '<img src=x onerror=alert(1)>';
  await addClassicDosaAndName(page, customerName);
  await page.getByRole('button', { name: /place my order/i }).click();

  await expect(page.locator('#order-details')).toContainText(customerName);
  await expect(page.locator('#order-details img')).toHaveCount(0);
});

import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

async function addClassicDosaAndName(page: import('@playwright/test').Page, name = 'Sasi Test') {
  await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
  await page.getByLabel('Your name').fill(name);
}

test('requires both a menu item and a customer name before ordering', async ({ page }) => {
  const placeOrder = page.locator('#place-order-btn');
  await expect(placeOrder).toBeDisabled();

  await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
  await expect(placeOrder).toBeDisabled();

  await page.locator('.menu-item').first().getByRole('button', { name: '−' }).click();
  await page.getByLabel('Your name').fill('Sasi Test');
  await expect(placeOrder).toBeDisabled();
});

test('places an order, shows a receipt, and resets the cart', async ({ page }) => {
  await addClassicDosaAndName(page);
  await page.locator('#place-order-btn').click();

  await expect(page.locator('#notification')).toContainText('Order placed successfully!');
  const orderId = await page.locator('#order-id').inputValue();
  expect(orderId).toMatch(/^DH-\d{8}$/);
  await expect(page.locator('#order-details')).toContainText('Sasi Test');
  await expect(page.locator('#order-details')).toContainText('₹180');
  await expect(page.locator('#order-details')).toContainText('Approved (demo only; no charge)');
  await expect(page.locator('#total-items')).toHaveText('0');
  await expect(page.locator('.empty-cart')).toBeVisible();
  await expect(page.getByLabel('Your name')).toHaveValue('');
});

test('declined and timed-out demo payments do not create orders', async ({ page }) => {
  await addClassicDosaAndName(page);
  await page.locator('#payment-outcome').selectOption('declined');
  await page.locator('#place-order-btn').click();

  await expect(page.locator('#notification')).toContainText('Demo payment declined');
  await expect(page.locator('#total-items')).toHaveText('1');
  expect(await page.evaluate(() => localStorage.getItem('dosa-house-orders'))).toBeNull();

  await page.locator('#payment-outcome').selectOption('timeout');
  await page.locator('#place-order-btn').click();
  await expect(page.locator('#notification')).toContainText('Demo payment timed out');
  await expect(page.locator('#total-items')).toHaveText('1');
  expect(await page.evaluate(() => localStorage.getItem('dosa-house-orders'))).toBeNull();
});

test('looks up an existing order and reports an unknown order', async ({ page }) => {
  await addClassicDosaAndName(page, 'Lookup Test');
  await page.locator('#place-order-btn').click();
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
  await page.locator('#place-order-btn').click();

  await expect(page.locator('#order-details')).toContainText(customerName);
  await expect(page.locator('#order-details img')).toHaveCount(0);
});

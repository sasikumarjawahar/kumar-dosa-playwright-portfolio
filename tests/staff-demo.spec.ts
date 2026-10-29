import { expect, test } from '@playwright/test';

const demoUsername = 'dosa.staff';
const demoPassword = 'tawa-demo';

test('shows a validation message for invalid demo credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('invalid-user');
  await page.getByLabel('Password').fill('invalid-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.locator('#login-message')).toContainText('Those demo details do not match');
  await expect(page).toHaveURL(/\/login(?:\.html)?\/?$/);
});

test('opens the demo dashboard and signs out', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill(demoUsername);
  await page.getByLabel('Password').fill(demoPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/protected\.html\/?$/);
  await expect(page.getByRole('heading', { name: 'A lovely day to serve.' })).toBeVisible();
  await expect(page.getByText('in this browser demo')).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login(?:\.html)?\/?$/);
  await expect(page.getByRole('heading', { name: 'Staff sign in' })).toBeVisible();
});

test('redirects a browser without the demo session away from the dashboard', async ({ page }) => {
  await page.goto('/protected.html');

  await expect(page).toHaveURL(/\/login(?:\.html)?\/?$/);
  await expect(page.getByRole('heading', { name: 'Staff sign in' })).toBeVisible();
});

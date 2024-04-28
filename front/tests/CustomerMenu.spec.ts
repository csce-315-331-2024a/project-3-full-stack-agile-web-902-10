import { test, expect } from '@playwright/test';

test('weather-exist-test', async ({ page }) => {
  await page.goto('http://localhost:3000/menu');
  await page.getByText('°F').isVisible();
});

test('normal-checkout-test', async ({ page }) => {
    await page.goto('http://localhost:3000/menu');
    await page.getByRole('button', { name: '2 Corn Dog Value Meal 2 Corn' }).click();
    await page.getByRole('button', { name: 'Corn Dog' }).click();
    await page.getByRole('button', { name: 'Corn Dog' }).click();
    await page.getByRole('button', { name: 'Ketchup' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByRole('button', { name: 'Gig Em Patty Melt Gig Em' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByRole('button', { name: 'Grilled Chicken Sandwich' }).click();
    await page.getByRole('button', { name: 'Onion' }).click();
    await page.getByRole('button', { name: 'Hamburger Bun' }).click();
    await page.getByRole('button', { name: 'Silverware Bundle' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByText('Cart:').click();
    await page.getByRole('link', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Pay' }).click();
    await page.getByRole('button', { name: 'Pay' }).click();
  });
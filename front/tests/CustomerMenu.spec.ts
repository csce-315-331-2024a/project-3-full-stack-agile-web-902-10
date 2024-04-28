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
    await page.getByRole('button', { name: 'Pay' }).isVisible();
  });

  test('category-test', async ({ page }) => {
    await page.goto('http://localhost:3000/menu');
    await page.getByRole('button', { name: 'Value Meals' }).click();
    await expect(page.getByRole('button', { name: 'Value Meals' })).toHaveCSS(
        "background-color",
        "rgba(22, 163, 74, 0.9)"
    );
    await page.getByRole('button', { name: 'Chicken' }).click();
    await expect(page.getByRole('button', { name: 'Chicken', exact: true})).toHaveCSS(
        "background-color",
        "rgba(22, 163, 74, 0.9)"
    );
    await expect(page.getByRole('button', { name: 'Value Meals' })).toHaveCSS(
        "background-color",
        "rgb(244, 244, 245)"
    );
    await page.getByRole('button', { name: 'Burgers' }).click();
    await expect(page.getByRole('button', { name: 'Burgers' })).toHaveCSS(
        "background-color",
        "rgba(22, 163, 74, 0.9)"
    );
    await page.getByRole('button', { name: 'Burgers' }).click();
    await expect(page.getByRole('button', { name: 'Burgers' })).toHaveCSS(
        "background-color",
        "rgba(244, 244, 245, 0.8)"
    );
  });
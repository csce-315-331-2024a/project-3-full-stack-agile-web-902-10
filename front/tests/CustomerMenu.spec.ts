import { test, expect } from '@playwright/test';

test('add items to cart and clear cart', async ({ page }) => {
    await page.goto('/menu');
    await page.getByRole('button', { name: 'Revs Grilled Chicken Sandwich' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByRole('button', { name: 'Sides' }).click();
    await page.getByRole('button', { name: 'French Fries' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.getByRole('button', { name: 'Beverages' }).click();
    await page.getByRole('button', { name: '20 OZ Fountain Drink' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
});

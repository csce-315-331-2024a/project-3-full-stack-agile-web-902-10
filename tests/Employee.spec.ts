import { test, expect } from '@playwright/test';

test('add items to cart and clear cart', async ({ page }) => {
    await page.goto('http://localhost:3000/manager');
    await page.getByRole('button', { name: 'Employees' }).click();
    await page.getByRole('button', { name: 'Zhongyou Wu Manager' }).click();
});
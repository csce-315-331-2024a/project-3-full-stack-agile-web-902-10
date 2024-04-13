import { test, expect } from '@playwright/test';

test('View Restock Report', async ({ page }) => {
    await page.goto('http://localhost:3000/manager_trends');
    await page.getByRole('button', { name: 'Restock Report' }).click();
    await page.getByRole('cell', { name: 'Straw' }).click();
    await page.getByRole('cell', { name: 'Hot Dog' }).click();
    await page.getByRole('cell', { name: 'Ketchup' }).click();
});

test('View What Sells Together Report', async ({ page }) => {  
    await page.goto('http://localhost:3000/manager_trends');
    await page.getByRole('button', { name: 'What Sells Together' }).click();
    await page.getByRole('cell', { name: 'Double Stack Burger' }).first().click();
    await page.getByRole('cell', { name: 'Double Stack Burger' }).nth(1).click();
    await page.getByRole('cell', { name: 'Item 2' }).click();
});
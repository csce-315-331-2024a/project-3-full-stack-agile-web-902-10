import { test, expect } from '@playwright/test';

// test('View Restock Report', async ({ page }) => {
//     await page.goto('/manager_trends');
//     await page.getByRole('button', { name: 'Restock Report' }).click();
//     await page.getByRole('cell', { name: 'Straw' }).click();
//     await page.getByRole('cell', { name: 'Hot Dog' }).click();
//     await page.getByRole('cell', { name: 'Ketchup' }).click();
// });


test('View What Sells Together Report', async ({ page }) => {  
    await page.goto('http://localhost:3000/manager_trends');
    await page.getByRole('button', { name: 'What Sells Together' }).click();
    await page.getByRole('cell', { name: 'Item 2' }).click();
});

test('Product Usage Chart', async ({ page }) => {  
    await page.goto('http://localhost:3000/manager_trends');
    await expect(page.locator('div').filter({ hasText: 'Select a trend with the' }).nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Product Usage Chart' }).click();
    await expect(page.getByRole('img')).toBeVisible();
});

test('Sales Report', async ({ page }) => {  
    await page.goto('http://localhost:3000/manager_trends');
    await page.getByRole('button', { name: 'Sales Report' }).click();
    await page.getByRole('img').click({
      position: {
        x: 95,
        y: 165
      }
    });
    await page.getByRole('img').click({
      position: {
        x: 134,
        y: 174
      }
    });
    await page.getByRole('img').click({
      position: {
        x: 176,
        y: 186
      }
    });
    await page.getByRole('img').click({
      position: {
        x: 211,
        y: 188
      }
    });
    await expect(page.getByRole('img')).toBeVisible();
    await page.getByRole('img').click({
      position: {
        x: 617,
        y: 231
      }
    });
});

test('Excess Report', async ({ page }) => {  
    await page.goto('http://localhost:3000/manager_trends');
    await page.getByRole('button', { name: 'Excess Report' }).click();
    await page.locator('a').getByRole('button', { name: 'Excess Report' }).click();
    await expect(page.getByText('Excess ReportIngredientTotal')).toBeVisible();
    await page.locator('div').filter({ hasText: 'Excess ReportIngredientTotal' }).nth(1).click();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Settings').click();
    await page.getByRole('button', { name: 'Close' }).click();
});



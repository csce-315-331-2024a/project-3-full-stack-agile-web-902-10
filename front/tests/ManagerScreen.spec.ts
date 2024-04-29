import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/menu');

  //login to site in order to access manager features
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email or phone').fill('csce.313.team.10@gmail.com');
  await page.getByLabel('Email or phone').press('Enter');
  await page.getByLabel('Enter your password').fill('5uO52^&Ea*l2');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();

  //start testing edit options
  await page.getByRole('button', { name: 'Edit Menu' }).click();
  await page.getByRole('img', { name: 'Corn Dog Value Meal' }).click();
  await page.getByRole('button', { name: 'Edit Ingredients' }).click();
  await page.getByRole('button', { name: 'Employees' }).click();
  await page.getByRole('button', { name: 'Edit Ingredients' }).click();
  await page.locator('.flex > div > .flex > button').first().click();
  await page.getByRole('button', { name: 'Close' }).click();

  //test the employee page
  await page.getByRole('button', { name: 'Employees' }).click();
  await page.getByRole('button', { name: 'Jonathan Moore Admin' }).first().click();
  await page.getByLabel('Admin: Jonathan Moore').click();

  //test history data retrival 
  await page.getByRole('button', { name: 'Order History' }).click();
  await page.getByLabel('Go to next page').click();
  await page.getByLabel('Go to next page').click();
  await page.getByRole('button', { name: 'Login History' }).click();
  await page.getByLabel('Go to next page').dblclick();

  //test manager trends page
  await page.getByRole('button', { name: 'Trends' }).click();
  await page.getByRole('button', { name: 'Product Usage Chart' }).click();
  await page.getByRole('button', { name: 'Sales Report' }).click();
  await page.getByRole('button', { name: 'Sales Report(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Sales Report(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Excess Report' }).click();
  await page.getByRole('button', { name: 'Restock Report' }).click();
  await page.getByRole('button', { name: 'What Sells Together' }).click();
  await page.getByRole('button', { name: 'What Sells Together(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Back to Manager' }).click();

  //test kitchen page
  await page.getByRole('button', { name: 'Kitchen' }).click();
  await page.getByRole('row', { name: '#48734 7/28/2024, 8:56:19 AM' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Complete Order' }).click();
  await page.locator('div').filter({ hasText: 'Back to DashboardKitchen:' }).nth(1).click();
  await page.getByRole('link', { name: 'Back to Dashboard' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Menu Board' }).click();
  const page1 = await page1Promise;
});

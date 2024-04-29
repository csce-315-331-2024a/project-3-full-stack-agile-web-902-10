import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  //testing the sign in 
  await page.goto('http://localhost:3000/menu');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email or phone').fill('csce.313.team.10@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').fill('5uO52^&Ea*l2');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();

  //test the casheir page
  await page.getByRole('button', { name: 'Cashier' }).click();
  await page.getByRole('button', { name: 'Corn Dog Value Meal $4' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Grilled Chicken Sandwich $' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Cart:' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  const page1Promise = page.waitForEvent('popup');

  //test menu board functionality
  await page.getByRole('button', { name: 'Menu Board' }).click();
  const page1 = await page1Promise;

  //test editing functions
  await page.getByRole('button', { name: 'Edit Menu' }).click();
  await page.locator('.flex > .flex > button > .inline-flex').first().click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByText('Chicken Tender ComboActiveEditDeactivate').click();
  await page.locator('div:nth-child(3) > div > div > .flex > button > .inline-flex').first().click();
  await page.getByLabel('Edit Menu Item').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByText('Add Item').click();
  await page.getByRole('button', { name: 'Select Date' }).click();
  await page.locator('.fixed').first().click();
  await page.getByPlaceholder('Type item name here.').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Edit Ingredients' }).click();
  await page.getByText('Add Ingredient').click();
  await page.getByRole('button', { name: 'Close' }).click();
  

  //test employee functionality 
  await page.getByRole('button', { name: 'Employees' }).click();
  await page.getByRole('button', { name: 'Sean Lee s*******@tamu.edu' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //test trends 
  await page.getByRole('button', { name: 'Trends' }).click();
  await page.getByRole('button', { name: 'Product Usage Chart' }).click();
  await page.getByRole('button', { name: 'Product Usage Chart(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Sales Report' }).click();
  await page.getByRole('button', { name: 'Sales Report(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Excess Report' }).click();
  await page.getByRole('button', { name: 'Excess Report(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Restock Report' }).click();
  await page.getByRole('button', { name: 'Restock Report(ℹ️)' }).click();
  await page.getByRole('button', { name: 'What Sells Together' }).click();
  await page.getByRole('button', { name: 'What Sells Together(ℹ️)' }).click();
  await page.getByRole('button', { name: 'Back to Manager' }).click();

  //test history
  await page.getByRole('button', { name: 'Order History' }).click();
  await page.getByLabel('Go to next page').click();
  await page.getByLabel('Go to next page').click();
  await page.getByLabel('Go to previous page').dblclick();
  await page.getByRole('button', { name: 'Login History' }).click();
  await page.getByLabel('Go to next page').click();
  await page.getByLabel('Go to next page').click();
  await page.getByLabel('Go to previous page').dblclick();
});

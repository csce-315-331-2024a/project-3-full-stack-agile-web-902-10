import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

    //testing cashier page
  await page.goto('http://localhost:3000/menu');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email or phone').fill('csce.313.team.10@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').fill('5uO52^&Ea*l2');
  await page.getByLabel('Enter your password').press('Enter');
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Cashier' }).click();
  await page.getByRole('button', { name: 'Corn Dog Value Meal $4' }).click();
  await page.getByRole('button', { name: 'Ketchup' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Chicken Tender Combo $8' }).click();
  await page.getByRole('button', { name: 'Fountain Drink' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Cheeseburger $6' }).click();
  await page.getByRole('button', { name: 'Silverware Bundle' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.getByRole('button', { name: 'Cart:' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();
});

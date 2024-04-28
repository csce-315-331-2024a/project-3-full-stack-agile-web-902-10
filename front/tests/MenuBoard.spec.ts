import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/menu_board');
  await page.locator('div').nth(1).isVisible();
  await page.locator('div').nth(2).isVisible();
  await page.locator('div').first().isVisible;
  await page.locator('div').first().isVisible;
  await page.locator('div').nth(3).isVisible();
  await page.locator('div').nth(1).isVisible;
  await page.locator('div').nth(1).isVisible;
});
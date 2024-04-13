import { test, expect } from '@playwright/test';

test('manager screen function', async({page}) =>{
    await page.goto('http://localhost:3000/manager');
    await page.getByText('Options').click();
    await page.getByRole('button', { name: 'Edit Menu' }).click();
    await page.getByRole('button', { name: 'Bacon Cheeseburger $' }).click();
    await page.getByRole('button', { name: 'Edit Item' }).click();
    await page.getByRole('button', { name: 'Bacon Cheeseburger $' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'Bacon Cheeseburger $' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByText('Add Item').click();
    await page.getByPlaceholder('Type item name here.').click();
    await page.getByPlaceholder('Type item name here.').fill('dsad');
    await page.getByPlaceholder('Type item catagory here.').click();
    await page.getByPlaceholder('Type item catagory here.').fill('sa');
    await page.locator('div').filter({ hasText: /^Beef Patty$/ }).getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Seasonal Item End Date' }).click();
    await page.getByText('13').click();
    await page.getByRole('button', { name: 'Trends' }).click();
    await page.getByRole('button', { name: 'Employees' }).click();
    await page.getByRole('button', { name: 'Sean Lee Manager' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Menu Board' }).click();
    const page1 = await page1Promise;
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByText('To Menu').click();
})
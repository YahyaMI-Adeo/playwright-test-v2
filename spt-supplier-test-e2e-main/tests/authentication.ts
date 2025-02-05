import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    await page.goto('https://dev.internal.supplier-v2.adeo.com');
    await page.locator('//*[@id="identifierInput"]').fill('20014357');
    await page.getByTitle('Next').click();
    await page.locator('//*[@id="password"]').fill('ler123');
    await page.getByTitle('Sign on').click();
    await page.waitForURL('https://dev.internal.supplier-v2.adeo.com/select-bu/');
    await page.context().storageState({ path: authFile });
});

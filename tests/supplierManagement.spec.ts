import { expect, test } from '@playwright/test';
import { accessAppFromSideBar, accessBaseUrl } from './helpers/helper';
import { Environment } from './helpers/environment';

test('Accès à "My Entity"', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromSideBar(page, '#SUPPLIER_DATA', '#ENTITIES');
    await expect(page.locator('spl-header-page').getByText('My Entities')).toBeVisible();
    await expect(page.getByText('BU legal No. :')).toBeVisible();
    await expect(page.getByText('VAT No. :')).toBeVisible();
    await expect(page.getByText('ADEO code :')).toBeVisible();
    await expect(page.getByText('Business Licence :')).toBeVisible();
});

test('Accès à "My BUs"', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromSideBar(page, '#SUPPLIER_DATA', '#MY_BU');
    await expect(page.locator('spl-header-page').getByText('My BUs')).toBeVisible();
    await expect(page.getByText('SUPPLIER :')).toBeVisible();
    await expect(page.locator('mat-card')).toBeVisible();
});

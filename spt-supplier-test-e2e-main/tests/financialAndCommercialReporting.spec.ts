import { expect, test } from '@playwright/test';
import { accessAppFromSideBar, accessBaseUrl } from './helpers/helper';
import { Environment } from './helpers/environment';

test('Accès à "Financial Reporting"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#ACCOUNTING', '#FINANCIAL_REPORTING');
    await expect(page.locator('fieldset').filter({ hasText: 'Supplier information' })).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Full name of contact' })).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Contact email' })).toBeVisible();
});

test('Accès à "Duplicata"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#ACCOUNTING', '#ESPACEFACT');
    await expect(page.getByText('Supplier search : Search')).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Supplier information' })).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Full name of contact' })).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Contact email' })).toBeVisible();
    await expect(page.getByPlaceholder('Company name or supplier code')).toBeVisible();
    await expect(page.locator('div:nth-child(2) > fieldset:nth-child(2) > .mc-field__container')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: /^Search$/ })).toBeVisible();
});

test('Accès à "Commercial Reporting"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#ACCOUNTING', '#FINANCIAL_REPORTING');
    await expect(page.getByText('Supplier search : Search')).toBeVisible();
    await expect(page.getByText('Supplier information')).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Full name of contact' })).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Supplier information' })).toBeVisible();
    await expect(page.locator('fieldset').filter({ hasText: 'Contact email' })).toBeVisible();
    await expect(page.getByPlaceholder('Company name or supplier code')).toBeVisible();
    await expect(page.locator('div:nth-child(2) > fieldset:nth-child(2) > .mc-field__container')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: /^Search$/ })).toBeVisible();
});

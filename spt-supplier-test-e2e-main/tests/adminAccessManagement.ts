import { expect, test } from '@playwright/test';
import { accessAppFromSideBar, accessBaseUrl, createUrlRegex } from './helpers/helper';
import { Environment } from './helpers/environment';
import SELECTORS from './selectors/selectors.json';

test('Accès à "Statistic"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#PERFORMS', '#STATS');
});

test('Accès à "BU Parameters"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#ADMINISTRATION_BU', '#BU_PARAM');
});

test('Accès à "Internal Access"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#ADMINISTRATION_BU', '#INTERNAL_ACCESSES');
});

test('Accès à "Supplier Access"', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromSideBar(page, '#ADMINISTRATION_BU', '#DEFAULT_SUPPLIER_APPLICATION');
});

test('Modification de quelques accès internes', async ({ page }) => {
    const BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/internal-accesses?bu=1`;
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await expect(page.getByText('Internal Access')).toBeVisible();
    const changeAccessFieldLocator = page.locator(SELECTORS.INTERNAL.INTERNAL_ACCESSES.ROLE_FIELDS).nth(3);
    await changeAccessFieldLocator.click();
    const roleToSet = (await changeAccessFieldLocator.textContent()) === 'Admin' ? 'No access' : 'Admin';
    await page.getByRole('option', { name: roleToSet }).locator('span').click();
    await page.waitForResponse(resp =>
        resp.url().includes('/apiAuth/api/directory/roles') &&
        (resp.status() === 204 || resp.status() === 200)
    );
    await page.goto(BASE_URL);
    await expect(changeAccessFieldLocator).toContainText(roleToSet);
});

test('Modification de quelques accès fournisseurs', async ({ page }) => {
    const BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/default-rights?bu=1`;
    await page.goto(BASE_URL);
    await expect(page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.FINANCE_TAB)).toBeVisible();
    await expect(page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.COMMERCIAL_TAB)).toBeVisible();
    await expect(page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.SERVICES_TAB)).toBeVisible();
    await page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.COMMERCIAL_TAB).click();
    const changeAccessFieldLocator = page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.ROLE_FIELDS).nth(3);
    await changeAccessFieldLocator.click();
    const roleToSet = (await changeAccessFieldLocator.textContent()) === 'Accessible by all users' ?
        'Accessible by all suppliers' : 'Accessible by all users';
    await page.getByRole('option', { name: roleToSet }).locator('span').click();
    await page.waitForResponse(resp =>
        resp.url().includes('/apiAuth/api/directory/application-bu-accesses') && resp.status() === 200
    );
    await page.goto(BASE_URL);
    await page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.COMMERCIAL_TAB).click();
    await expect(changeAccessFieldLocator).toContainText(roleToSet);
});

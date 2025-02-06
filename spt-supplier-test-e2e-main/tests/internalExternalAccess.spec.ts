import {expect, Page, test} from '@playwright/test';
import { accessAppFromSideBar, accessBaseUrl, createUrlRegex, loginToPortal, logoutFromPortal } from './helpers/helper';
import { Environment } from './helpers/environment';

const BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/directory/supplier`;

test.describe.configure({ mode: 'serial' });

async function setDateInCalendarForArticleListing(page: Page): Promise<void> {
    await page.getByRole('row', { name: 'Articles listing' }).locator('input').first().click();
    await page.getByLabel('Previous month').click();
    await page.getByText('1', { exact: true }).click();
    await page.getByRole('button', { name: 'Save' }).click();
}

async function removeDateInCalendarForArticleListing(page : Page): Promise<void> {
    await page.getByRole('row', { name: 'Articles listing' }).locator('mat-icon').click();
    await page.getByRole('button', { name: 'Save' }).click();
}

async function accessToSupplier(page : Page): Promise<void> {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await page.getByLabel('Company name or supplier code').fill('3B S.P.A.');
    await page.getByRole('button', { name: 'search', exact: true }).click();
    await page.getByRole('gridcell', { name: /3\s*B\s*-?\s*S\.P\.A/i }).click();
    await page.getByRole('button', { name: 'Manage access rights' }).first().click();
}

test('Ajout d’accès externe depuis l’interne', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await accessToSupplier(page);
    await setDateInCalendarForArticleListing(page);
    await logoutFromPortal(page);
});

test('Retrait d’accès externe depuis l’interne', async ({ page }) => {
    await accessToSupplier(page);
    await removeDateInCalendarForArticleListing(page);
    await logoutFromPortal(page);
});

test('Vérification accès pour utilisateur non autorisé', async ({ page }) => {
    await loginToPortal(page, Environment.EXTERNAL, process.env.EXTERNAL_UNAUTHORIZED_USERNAME, process.env.EXTERNAL_UNAUTHORIZED_PASSWORD, true);
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromSideBar(page, '#PRODUCT', '#ARTICLES_LISTING');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/platform/?bu=1`));
    await logoutFromPortal(page);
});

test('Réajout d’accès externe depuis l’interne', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await accessToSupplier(page);
    await setDateInCalendarForArticleListing(page);
    await logoutFromPortal(page);
});

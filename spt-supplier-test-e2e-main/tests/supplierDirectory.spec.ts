import { expect, Locator, Page, test } from '@playwright/test';
import { accessAppFromUserMenu, accessBaseUrl } from './helpers/helper';
import { Environment } from './helpers/environment';
import SELECTORS from './selectors/selectors.json';

const BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/directory/supplier`;

async function accessToSupplierInDirectoryByName(page: Page, supplierName: string): Promise<void> {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await page.getByLabel('Company name or supplier code').fill(supplierName);
    await page.getByLabel('Company name or supplier code').press('Enter');
}

async function setDateInCalendar(page: Page) {
    await page.locator('#mat-input-5').click();
    await page.getByLabel('Previous month').click();
    await page.getByText('1', { exact: true }).click();
    await page.getByRole('button', { name: 'Save' }).click();
}

test('Accès au répertoire fournisseur', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL);
    await accessAppFromUserMenu(page, '#DIRECTORY_INTERNAL');
    await page.waitForURL(BASE_URL);
});

test('Recherche par informations fournisseur', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await page.waitForURL(`${BASE_URL}?bu=1`);
    await page.getByLabel('Company name or supplier code').fill('206729');
    await page.getByRole('button', { name: 'search', exact: true }).click();
    await expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR)).toBeVisible();
});

test('Recherche par nom dans le répertoire', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await page.waitForURL(`${BASE_URL}?bu=1`);
    await page.getByText('Full name of contact').click();
    await page.getByLabel('Surname').fill('LIM');
    await page.getByLabel('First name').fill('Philippe');
    await page.getByRole('button', { name: 'search', exact: true }).click();
    await expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR)).toBeVisible();
});

test('Recherche par email dans le répertoire', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await page.waitForURL(`${BASE_URL}?bu=1`);
    await page.getByText('Contact email').click();
    await page.getByLabel('Email', { exact: true }).fill('anonymous-47092@adeo.com');
    await page.getByRole('button', { name: 'search', exact: true }).click();
    await expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR)).toBeVisible();
});

test.describe.serial('Fourniture d’accès fournisseur par entité', () => {
    test('FOUJUR Handler', async ({ page }) => {
        await accessToSupplierInDirectoryByName(page, '3M');
        await page.getByRole('gridcell', { name: /3M/i }).click();
        const element = await page.waitForSelector(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUJUR_BUTTON, { timeout: 10000 }).catch(() => null);
        if (!element) {
            await page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.SWITCH_RIGHT_TOGGLE).click();
            await page.getByRole('button', { name: 'Confirm' }).click();
        }
        await page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUJUR_BUTTON).click();
        await setDateInCalendar(page);
        await page.waitForResponse(resp =>
            resp.url().includes('/apiAuth/api/directory/supplier-application-accesses/legal-suppliers') &&
            resp.status() === 200
        );
    });

    test('FOUCOM Handler', async ({ page }) => {
        await accessToSupplierInDirectoryByName(page, '3M');
        await page.getByRole('gridcell', { name: /3M/i }).click();
        const element = await page.waitForSelector(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUJUR_BUTTON, { timeout: 10000 }).catch(() => null);
        if (element) {
            await page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.SWITCH_RIGHT_TOGGLE).click();
            await page.getByRole('button', { name: 'Confirm' }).click();
        }
        await page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUCOM_BUTTON).first().click();
        await setDateInCalendar(page);
        await page.waitForResponse(resp =>
            resp.url().includes('/apiAuth/api/directory/supplier-application-accesses/suppliers') &&
            resp.status() === 200
        );
    });
});

test('Activation d’un fournisseur via création d\'admin', async ({ page }) => {
    await accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    await page.locator('mat-card').filter({ hasText: 'Inactive' }).click();
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR).click();
    await page.getByText('Entities').click();
    await page.getByText('Contacts').click();
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_CONTACT_BUTTONS).nth(1).click();
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.CIVILITY_INPUT).click();
    await page.getByText('Mr', { exact: true }).click();
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.LASTNAME_INPUT).fill('test');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.FIRSTNAME_INPUT).fill('test');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.MIDDLE_NAME_INPUT).fill('test');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.JOB_INPUT).fill('test');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.EMAIL_INPUT).fill('BOT.LMITLuigiBuffon@rpa.adeo.com');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.CONFIRM_EMAIL_INPUT).fill('BOT.LMITLuigiBuffon@rpa.adeo.com');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.PHONE_INPUT).fill('+33777777777');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.CELLPHONE_INPUT).fill('+33777777777');
    await page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.LANGUAGE_INPUT).click();
    await page.getByText('English').click();
    await expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.SAVE_BUTTON)).toBeVisible();
    await expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.SAVE_BUTTON)).toBeEnabled();
});

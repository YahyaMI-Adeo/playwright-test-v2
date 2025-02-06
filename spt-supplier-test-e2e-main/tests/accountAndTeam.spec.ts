import { expect, test } from '@playwright/test';
import { accessAppFromUserMenu, accessBaseUrl, createUrlRegex } from './helpers/helper';
import { Environment } from './helpers/environment';
import SELECTORS from './selectors/selectors.json';

test('Accès à la page "My Account"', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#DIRECTORY');
    await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/my-account`));
    await expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.USER_ID)).toHaveText(process.env.EXTERNAL_USERNAME);
    await expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.EMAIL_CONTAINER)).toBeVisible();
    await expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.JOB_CONTAINER)).toBeVisible();
    await expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.LANGUAGE_DETAILS)).toBeVisible();
    await expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.EDIT_INFO_BUTTON)).toBeVisible();
});

test('Accès à la page "My Team"', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#MY_TEAM');
    await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.BUTTON)).toBeVisible();
    await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.TABS.CONTACT_TAB)).toBeVisible();
    await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.TABS.FUNCTION_TAB)).toBeVisible();
    await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.TABS.ACCESS_TAB)).toBeVisible();
});

test('Modification des informations de contact', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#MY_TEAM');
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.EDIT_CONTACT_BUTTON).click();
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.PHONE_INPUT).fill('9606060606');
    await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.EDIT_CONTACT_DIALOG.VALIDATE_BUTTON)).toBeDisabled();
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.PHONE_INPUT).fill('+48124567835');
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.EDIT_CONTACT_DIALOG.VALIDATE_BUTTON).click();
    await page.waitForResponse(resp => resp.url().includes('/partner-data-bff/contacts/') && resp.status() === 200);
});

import { expect, test } from '@playwright/test';
import { accessAppFromUserMenu, accessBaseUrl } from './helpers/helper';
import { Environment } from './helpers/environment';
import SELECTORS from './selectors/selectors.json';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = { dictionaries: [names] };
const name = uniqueNamesGenerator(config);

test.describe.configure({ mode: 'serial' });

test('Création d’un nouveau contact', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#MY_TEAM');
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.BUTTON).click();
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.CIVILITY_INPUT).click();
    await page.getByLabel('Unknown').press('ArrowDown');
    await page.getByLabel('Unknown').press('ArrowDown');
    await page.getByLabel('Unknown').press('Enter');
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.FIRSTNAME_INPUT).fill(name);
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.LASTNAME_INPUT).fill(name);
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.MIDDLE_NAME_INPUT).fill(name);
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.JOB_INPUT).fill(name);
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.EMAIL_INPUT).fill(`${name}@${name}.com`);
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.CONFIRM_EMAIL_INPUT).fill(`${name}@${name}.com`);
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.PHONE_INPUT).fill('+33777777777');
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.CELLPHONE_INPUT).fill('+33777777777');
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.LANGUAGE_INPUT).click();
    await page.getByText('English').click();
    await page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.FAX_INPUT).fill('+33777777777');
    const saveButton = page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.SAVE_BUTTON).first();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await page.waitForResponse(resp => resp.url().includes('/partner-data-bff/users') && resp.status() === 200);
});

test('Désactivation du contact', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#MY_TEAM');
    await page.getByRole('row', { name: `Mr ${name} ${name}` }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'De-activate contact' }).click();
    await page.waitForResponse(resp => {
        const userRegex = /\/apiAuth\/api\/directory\/users\/\d+/;
        return userRegex.test(resp.url()) && (resp.status() === 200 || resp.status() === 204);
    });
});

test('Réactivation du contact', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#MY_TEAM');
    await page.getByRole('row', { name: `Mr ${name} ${name}` }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Activate contact' }).click();
    await page.waitForResponse(resp => resp.url().includes('/partner-data-bff/users') && resp.status() === 200);
});

test('Suppression du contact', async ({ page }) => {
    await accessBaseUrl(page, Environment.EXTERNAL);
    await accessAppFromUserMenu(page, '#MY_TEAM');
    await page.getByRole('row', { name: `Mr ${name} ${name}` }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Remove contact' }).click();
    await page.waitForResponse(resp => resp.url().includes('/partner-data-bff/contacts/delete') && resp.status() === 200);
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect, test } from "@playwright/test";
import { accessAppFromUserMenu, accessBaseUrl } from "./helpers/helper";
import { Environment } from "./helpers/environment";
import SELECTORS from './selectors/selectors.json';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
const config = {
    dictionaries: [names]
};
const name = uniqueNamesGenerator(config);
test.describe.configure({ mode: 'serial' });
test('create new user', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.BUTTON).click();
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.CIVILITY_INPUT).click();
    yield page.getByLabel('Unknown').press('ArrowDown');
    yield page.getByLabel('Unknown').press('ArrowDown');
    yield page.getByLabel('Unknown').press('Enter');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.FIRSTNAME_INPUT).fill(name);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.LASTNAME_INPUT).fill(name);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.MIDDLE_NAME_INPUT).fill(name);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.JOB_INPUT).fill(name);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.EMAIL_INPUT).fill(`${name}@${name}.com`);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.CONFIRM_EMAIL_INPUT).fill(`${name}@${name}.com`);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.PHONE_INPUT).fill('+33777777777');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.CELLPHONE_INPUT).fill('+33777777777');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.LANGUAGE_INPUT).click();
    yield page.getByText('English').click();
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.FAX_INPUT).fill('+33777777777');
    let saveButton = page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.SAVE_BUTTON).first();
    yield expect(saveButton).toBeVisible();
    yield expect(saveButton).toBeEnabled();
    yield saveButton.click();
    yield Promise.all([
        page.waitForResponse(resp => resp.url().includes('/partner-data-bff/users') && resp.status() === 200)
    ]);
}));
test('de-activate contact', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield page.getByRole('row', { name: `Mr ${name} ${name}` }).getByRole('button').click();
    yield page.getByRole('menuitem', { name: 'De-activate contact' }).click();
    yield Promise.all([
        page.waitForResponse(resp => {
            const url = resp.url();
            const userRegex = /\/apiAuth\/api\/directory\/users\/\d+/;
            return userRegex.test(url) && (resp.status() === 200 || resp.status() === 204);
        })
    ]);
}));
test('re-activate contact', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield page.getByRole('row', { name: `Mr ${name} ${name}` }).getByRole('button').click();
    yield page.getByRole('menuitem', { name: 'Activate contact' }).click();
    yield Promise.all([
        page.waitForResponse(resp => resp.url().includes('/partner-data-bff/users') && resp.status() === 200)
    ]);
}));
test('delete contact', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield page.getByRole('row', { name: `Mr ${name} ${name}` }).getByRole('button').click();
    yield page.getByRole('menuitem', { name: 'Remove contact' }).click();
    yield Promise.all([
        page.waitForResponse(resp => resp.url().includes('/partner-data-bff/contacts/delete') && resp.status() === 200)
    ]);
}));

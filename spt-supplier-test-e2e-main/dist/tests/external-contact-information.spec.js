var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect, test } from '@playwright/test';
import { accessAppFromUserMenu, accessBaseUrl, createUrlRegex } from "./helpers/helper";
import SELECTORS from './selectors/selectors.json';
import { Environment } from "./helpers/environment";
test.describe.configure({ mode: 'serial' });
test('access my account page', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#DIRECTORY');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/my-account`));
    yield expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.USER_ID)).toHaveText(process.env.EXTERNAL_USERNAME);
    yield expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.EMAIL_CONTAINER)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.JOB_CONTAINER)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.LANGUAGE_DETAILS)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.ACCOUNT.EDIT_INFO_BUTTON)).toBeVisible();
}));
test('access my team page', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.BUTTON)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.TABS.CONTACT_TAB)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.TABS.FUNCTION_TAB)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.TABS.ACCESS_TAB)).toBeVisible();
}));
test('edit contact information', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.EDIT_CONTACT_BUTTON).click();
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.PHONE_INPUT).fill('9606060606');
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.EDIT_CONTACT_DIALOG.VALIDATE_BUTTON)).toBeDisabled();
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.NEW_CONTACT.PHONE_INPUT).fill('+48124567835');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.EDIT_CONTACT_DIALOG.VALIDATE_BUTTON).click();
    yield Promise.all([
        page.waitForResponse(resp => resp.url().includes('/partner-data-bff/contacts/') && resp.status() === 200),
    ]);
}));

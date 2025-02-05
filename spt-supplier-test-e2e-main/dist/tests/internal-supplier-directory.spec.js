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
import { accessAppFromUserMenu, accessBaseUrl } from "./helpers/helper";
import { Environment } from "./helpers/environment";
import SELECTORS from "./selectors/selectors.json";
const BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/directory/supplier`;
function accessToSupplierInDirectoryByName(page, supplierName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
        yield page.getByLabel('Company name or supplier code').fill(supplierName);
        yield page.getByLabel('Company name or supplier code').press('Enter');
    });
}
function setDateInCalendar(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.locator('#mat-input-5').click();
        yield page.getByLabel('Previous month').click();
        yield page.getByText('1', { exact: true }).click();
        yield page.getByRole('button', { name: 'Save' }).click();
    });
}
test('Supplier Directory Access', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromUserMenu(page, '#DIRECTORY_INTERNAL');
    yield page.waitForURL(BASE_URL);
}));
test('Search for user in directory by supplier info', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield page.waitForURL(`${BASE_URL}?bu=1`);
    yield page.getByLabel('Company name or supplier code').fill('206729');
    yield page.getByRole('button', { name: 'search', exact: true }).click();
    yield expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR)).toBeVisible();
}));
test('Search for user in directory by name', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield page.waitForURL(`${BASE_URL}?bu=1`);
    yield page.getByText('Full name of contact').click();
    yield page.getByLabel('Surname').fill('LIM');
    yield page.getByLabel('First name').fill('Philippe');
    yield page.getByRole('button', { name: 'search', exact: true }).click();
    yield expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR)).toBeVisible();
}));
test('Search for user in directory by email', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield page.waitForURL(`${BASE_URL}?bu=1`);
    yield page.getByText('Contact email').click();
    yield page.getByLabel('Email', { exact: true }).fill('anonymous-47092@adeo.com');
    yield page.getByRole('button', { name: 'search', exact: true }).click();
    yield expect(page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR)).toBeVisible();
}));
test.describe.serial('Provide supplier accesses by entity', () => {
    test('FOUJUR Handler', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield accessToSupplierInDirectoryByName(page, '3M');
        yield page.getByRole('gridcell', { name: /3M/i }).click();
        const element = yield page.waitForSelector(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUJUR_BUTTON, { timeout: 10000 }).catch(() => null);
        if (!element) {
            yield page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.SWITCH_RIGHT_TOOGLE).click();
            yield page.getByRole('button', { name: 'Confirm' }).click();
        }
        yield page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUJUR_BUTTON).click();
        yield setDateInCalendar(page);
        yield Promise.all([
            page.waitForResponse(resp => resp.url().includes('/apiAuth/api/directory/supplier-application-accesses/legal-suppliers') && resp.status() === 200),
        ]);
    }));
    test('FOUCOM Handler', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield accessToSupplierInDirectoryByName(page, '3M');
        yield page.getByRole('gridcell', { name: /3M/i }).click();
        const element = yield page.waitForSelector(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUJUR_BUTTON, { timeout: 10000 }).catch(() => null);
        if (element) {
            yield page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.SWITCH_RIGHT_TOOGLE).click();
            yield page.getByRole('button', { name: 'Confirm' }).click();
        }
        yield page.locator(SELECTORS.INTERNAL.DIRECTORY.ENTITIES.CHANGE_RIGHT_FOUCOM_BUTTON).first().click();
        yield setDateInCalendar(page);
        yield Promise.all([
            page.waitForResponse(resp => resp.url().includes('/apiAuth/api/directory/supplier-application-accesses/suppliers') && resp.status() === 200),
        ]);
    }));
});
test('Activate a supplier by admin creation', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield page.locator('mat-card').filter({ hasText: 'Inactive' }).click();
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.SEARCH_FIRST_ROW_SELECTOR).click();
    yield page.getByText('Entities').click();
    yield page.getByText('Contacts').click();
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_CONTACT_BUTTONS).nth(1).click();
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.CIVILITY_INPUT).click();
    yield page.getByText('Mr', { exact: true }).click();
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.LASTNAME_INPUT).fill('test');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.FIRSTNAME_INPUT).fill('test');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.MIDDLE_NAME_INPUT).fill('test');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.JOB_INPUT).fill('test');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.EMAIL_INPUT).fill('BOT.LMITLuigiBuffon@rpa.adeo.com');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.CONFIRM_EMAIL_INPUT).fill('BOT.LMITLuigiBuffon@rpa.adeo.com');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.PHONE_INPUT).fill('+33777777777');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.CELLPHONE_INPUT).fill('+33777777777');
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.LANGUAGE_INPUT).click();
    yield page.getByText('English').click();
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.SAVE_BUTTON).isVisible();
    yield page.locator(SELECTORS.INTERNAL.DIRECTORY.CONTACTS.CREATE_ADMIN_CONTACT_MODAL.SAVE_BUTTON).isEnabled();
}));

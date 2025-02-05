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
import { accessAppFromSideBar, accessBaseUrl } from "./helpers/helper";
import { Environment } from "./helpers/environment";
import SELECTORS from "./selectors/selectors.json";
test('access to "Statistic"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#PERFORMS', '#STATS');
}));
test('access to "BU Parameters"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#ADMINISTRATION_BU', '#BU_PARAM');
}));
test('access to "Internal Access"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#ADMINISTRATION_BU', '#INTERNAL_ACCESSES');
}));
test('access to "Supplier Access"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#ADMINISTRATION_BU', '#DEFAULT_SUPPLIER_APPLICATION');
}));
test('provide some Internal Accesses', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    let BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/internal-accesses?bu=1`;
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield expect(page.getByText('Internal Access')).toBeVisible();
    const changeAccessFieldLocator = page.locator(SELECTORS.INTERNAL.INTERNAL_ACCESSES.ROLE_FIELDS).nth(3);
    yield changeAccessFieldLocator.click();
    const roleToSet = (yield changeAccessFieldLocator.textContent()) === 'Admin' ? 'No access' : 'Admin';
    yield page.getByRole('option', { name: roleToSet }).locator('span').click();
    yield Promise.all([
        page.waitForResponse(resp => resp.url().includes('/apiAuth/api/directory/roles') && (resp.status() === 204 || resp.status() === 200)),
    ]);
    yield page.goto(BASE_URL);
    yield expect(changeAccessFieldLocator).toContainText(roleToSet);
}));
test('provide some Supplier Accesses', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    let BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/default-rights?bu=1`;
    yield page.goto(BASE_URL);
    yield expect(page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.FINANCE_TAB)).toBeVisible();
    yield expect(page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.COMMERCIAL_TAB)).toBeVisible();
    yield expect(page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.SERVICES_TAB)).toBeVisible();
    yield page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.COMMERCIAL_TAB).click();
    const changeAccessFieldLocator = page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.ROLE_FIELDS).nth(3);
    yield changeAccessFieldLocator.click();
    const roleToSet = (yield changeAccessFieldLocator.textContent()) === 'Accessible by all users' ?
        'Accessible by all suppliers' : 'Accessible by all users';
    yield page.getByRole('option', { name: roleToSet }).locator('span').click();
    yield Promise.all([
        page.waitForResponse(resp => resp.url().includes('/apiAuth/api/directory/application-bu-accesses') && resp.status() === 200),
    ]);
    yield page.goto(BASE_URL);
    yield page.locator(SELECTORS.INTERNAL.SUPPLIER_ACCESSES.TABS.COMMERCIAL_TAB).click();
    yield expect(changeAccessFieldLocator).toContainText(roleToSet);
}));

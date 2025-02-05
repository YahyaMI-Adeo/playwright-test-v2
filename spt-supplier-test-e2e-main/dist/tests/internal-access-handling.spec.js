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
import { accessAppFromSideBar, accessBaseUrl, createUrlRegex, loginToPortal, logoutFromPortal } from "./helpers/helper";
import { Environment } from "./helpers/environment";
test.describe.configure({ mode: 'serial' });
let BASE_URL = `${process.env.INTERNAL_URL}/supplier-platform-core/1/directory/supplier`;
function setDateInCalendarForArticleListing(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.getByRole('row', { name: 'Articles listing' }).locator('input').first().click();
        yield page.getByLabel('Previous month').click();
        yield page.getByText('1', { exact: true }).click();
        yield page.getByRole('button', { name: 'Save' }).click();
    });
}
function removeDateInCalendarForArticleListing(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.getByRole('row', { name: 'Articles listing' }).locator('mat-icon').click();
        yield page.getByRole('button', { name: 'Save' }).click();
    });
}
function accessToSupplier(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
        yield page.getByLabel('Company name or supplier code').fill('3B S.P.A.');
        yield page.getByRole('button', { name: 'search', exact: true }).click();
        yield page.getByRole('gridcell', { name: /3\s*B\s*-?\s*S\.P\.A/i }).click();
        yield page.getByRole('button', { name: 'Manage access rights' }).first().click();
    });
}
test('first add access to external from internal', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield accessToSupplier(page);
    yield setDateInCalendarForArticleListing(page);
    yield logoutFromPortal(page);
}));
test('remove access to external from internal', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessToSupplier(page);
    yield removeDateInCalendarForArticleListing(page);
    yield logoutFromPortal(page);
}));
test('check access to unauthorized app', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield loginToPortal(page, Environment.EXTERNAL, process.env.EXTERNAL_UNAUTHORIZED_USERNAME, process.env.EXTERNAL_UNAUTHORIZED_PASSWORD, true);
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromSideBar(page, '#PRODUCT', '#ARTICLES_LISTING');
    yield page.waitForTimeout(2000);
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/platform/?bu=1`));
    yield logoutFromPortal(page);
}));
test('add access to external from internal again', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL, BASE_URL);
    yield accessToSupplier(page);
    yield setDateInCalendarForArticleListing(page);
    yield logoutFromPortal(page);
}));

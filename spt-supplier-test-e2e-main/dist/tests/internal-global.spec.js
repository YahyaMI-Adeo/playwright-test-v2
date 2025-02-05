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
test('access to "Financial Reporting"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#ACCOUNTING', '#FINANCIAL_REPORTING');
    yield expect(page.locator('fieldset').filter({ hasText: 'Supplier information' })).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Full name of contact' })).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Contact email' })).toBeVisible();
}));
test('access to "Duplicata"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#ACCOUNTING', '#ESPACEFACT');
    yield expect(page.getByText('Supplier search : Search')).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Supplier information' })).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Full name of contact' })).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Contact email' })).toBeVisible();
    yield expect(page.getByPlaceholder('Company name or supplier code')).toBeVisible();
    yield expect(page.locator('div:nth-child(2) > fieldset:nth-child(2) > .mc-field__container')).toBeVisible();
    yield expect(page.locator('button').filter({ hasText: /^Search$/ })).toBeVisible();
}));
test('access to "Commercial Reporting"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.INTERNAL);
    yield accessAppFromSideBar(page, '#ACCOUNTING', '#FINANCIAL_REPORTING');
    yield expect(page.getByText('Supplier search : Search')).toBeVisible();
    yield expect(page.getByText('Supplier information')).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Full name of contact' })).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Supplier information' })).toBeVisible();
    yield expect(page.locator('fieldset').filter({ hasText: 'Contact email' })).toBeVisible();
    yield expect(page.getByPlaceholder('Company name or supplier code')).toBeVisible();
    yield expect(page.locator('div:nth-child(2) > fieldset:nth-child(2) > .mc-field__container')).toBeVisible();
    yield expect(page.locator('button').filter({ hasText: /^Search$/ })).toBeVisible();
}));

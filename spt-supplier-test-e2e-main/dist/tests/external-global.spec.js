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
test('access to "My Entity"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromSideBar(page, '#SUPPLIER_DATA', '#ENTITIES');
    yield expect(page.locator('spl-header-page').getByText('My Entities')).toBeVisible();
    yield expect(page.getByText('BU legal No. :')).toBeVisible();
    yield expect(page.getByText('VAT No. :')).toBeVisible();
    yield expect(page.getByText('ADEO code :')).toBeVisible();
    yield expect(page.getByText('Business Licence :')).toBeVisible();
}));
test('access to "My BUs"', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromSideBar(page, '#SUPPLIER_DATA', '#MY_BU');
    yield expect(page.locator('spl-header-page').getByText('My BUs')).toBeVisible();
    yield expect(page.getByText('SUPPLIER :')).toBeVisible();
    yield expect(page.locator('mat-card')).toBeVisible();
}));

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
Given('I open Google', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.page.goto('https://www.google.com');
    });
});
When('I search for {string}', function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.page.fill('input[name="q"]', query);
        yield this.page.press('input[name="q"]', 'Enter');
    });
});
Then('I should see a link to the Adeo website', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const link = yield this.page.locator('text=Adeo').first();
        expect(yield link.isVisible()).toBeTruthy();
    });
});

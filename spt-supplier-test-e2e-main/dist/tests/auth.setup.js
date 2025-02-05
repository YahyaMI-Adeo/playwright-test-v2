var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { test as setup } from '@playwright/test';
import path from 'path';
const authFile = path.join(__dirname, '../playwright/.auth/user.json');
setup('authenticate', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto('https://dev.internal.supplier-v2.adeo.com');
    yield page.locator('//*[@id="identifierInput"]').fill('20014357');
    yield page.getByTitle('Next').click();
    yield page.locator('//*[@id="password"]').fill('ler123');
    yield page.getByTitle('Sign on').click();
    yield page.waitForURL('https://dev.internal.supplier-v2.adeo.com/select-bu/');
    yield page.context().storageState({ path: authFile });
}));

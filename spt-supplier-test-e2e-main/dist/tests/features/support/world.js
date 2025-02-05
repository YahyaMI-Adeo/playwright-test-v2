var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
export class CustomWorld extends World {
    openBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield chromium.launch();
            this.context = yield this.browser.newContext();
            this.page = yield this.context.newPage();
        });
    }
    closeBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.close();
            yield this.context.close();
            yield this.browser.close();
        });
    }
}
setWorldConstructor(CustomWorld);

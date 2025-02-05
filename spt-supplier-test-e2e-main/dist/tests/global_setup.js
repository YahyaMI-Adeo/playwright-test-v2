var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { chromium } from '@playwright/test';
import { loginToPortal } from "./helpers/helper";
import { Environment } from "./helpers/environment";
function setupExternal(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loginToPortal(page, Environment.EXTERNAL, process.env.EXTERNAL_USERNAME, process.env.EXTERNAL_PASSWORD);
        yield page.context().storageState({ path: 'auth-external.json' });
    });
}
function setupInternal(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loginToPortal(page, Environment.INTERNAL, process.env.INTERNAL_USERNAME, process.env.INTERNAL_PASSWORD);
        yield page.context().storageState({ path: 'auth-internal.json' });
    });
}
function globalSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield chromium.launch();
        const page = yield browser.newPage();
        try {
            yield setupExternal(page);
            yield setupInternal(page);
        }
        catch (error) {
            console.error('Error during global setup:', error);
        }
        finally {
            yield browser.close();
        }
    });
}
export default globalSetup;

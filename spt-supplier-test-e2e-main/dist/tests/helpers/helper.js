var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Environment } from "./environment";
import path from "path";
const authFileInternal = path.join(__dirname, '../../playwright/.auth-internal/user.json');
const authFileExternal = path.join(__dirname, '../../playwright/.auth-external/user.json');
export function createUrlRegex(url) {
    const escapedUrl = url.replace(/[+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedUrl);
}
export function passSelectBu(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const element = yield page.waitForSelector('#idtest-select-bu-select-option-1', { timeout: 10000 }).catch(() => null);
        if (element) {
            yield element.click();
        }
    });
}
export function accessBaseUrl(page, env, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let localUrl = url;
        if (localUrl === undefined) {
            switch (env) {
                case Environment.EXTERNAL:
                    localUrl = `${process.env.EXTERNAL_URL}/platform`;
                    break;
                case Environment.INTERNAL:
                    localUrl = `${process.env.INTERNAL_URL}/platform`;
                    break;
            }
        }
        yield page.goto(localUrl);
    });
}
export function accessAppFromSideBar(page, menuId, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.locator('#mc-sidebar__trigger').click();
        yield page.locator(menuId).click();
        yield page.locator(appId).click();
        const element = yield page.waitForSelector('text=LEROY MERLIN FRANCE', { timeout: 10000 }).catch(() => null);
        if (element && (yield element.isVisible())) {
            yield element.click();
        }
    });
}
export function accessAppFromUserMenu(page, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.locator('#user-trigger').click();
        yield page.locator(appId).click();
        yield passSelectBu(page);
    });
}
export function logoutFromPortal(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.locator('#user-trigger').click();
        yield page.locator('#logout-button').click();
        yield page.waitForSelector('text=Signed out', { timeout: 10000 });
    });
}
export function loginToPortal(page, env, login, password, noPersistence = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let localUrl = '';
        let storageStateName = '';
        switch (env) {
            case Environment.EXTERNAL:
                localUrl = `${process.env.EXTERNAL_URL}`;
                storageStateName = authFileExternal;
                break;
            case Environment.INTERNAL:
                localUrl = `${process.env.INTERNAL_URL}`;
                storageStateName = authFileInternal;
                break;
        }
        yield page.goto(localUrl);
        yield page.locator('//*[@id="identifierInput"]').fill(login);
        yield page.getByTitle('Next').click();
        yield page.locator('//*[@id="password"]').fill(password);
        yield page.getByTitle('Sign on').click();
        if (!noPersistence) {
            yield page.context().storageState({ path: storageStateName });
        }
    });
}

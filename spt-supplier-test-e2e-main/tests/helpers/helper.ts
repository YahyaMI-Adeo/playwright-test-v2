import { Page } from "@playwright/test";
import { Environment } from "./environment";
import path from "path";

const authFileInternal = path.join(__dirname, '../../playwright/.auth-internal/user.json');
const authFileExternal = path.join(__dirname, '../../playwright/.auth-external/user.json');

export function createUrlRegex(url: string): RegExp {
    const escapedUrl = url.replace(/[+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedUrl);
}

export async function passSelectBu(page: Page) {
    const element = await page.waitForSelector('#idtest-select-bu-select-option-1', { timeout: 10000 }).catch(() => null);
    if (element) {
        await element.click();
    }
}

export async function accessBaseUrl(page: Page, env: Environment, url?: string) {
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
    await page.goto(localUrl);
}

export async function accessAppFromSideBar(page: Page, menuId: string, appId: string) {
    await page.locator('#mc-sidebar__trigger').click();
    await page.locator(menuId).click();
    await page.locator(appId).click();
    const element = await page.waitForSelector('text=LEROY MERLIN FRANCE', { timeout: 10000 }).catch(() => null);
    if (element && await element.isVisible()) {
        await element.click();
    }
}

export async function accessAppFromUserMenu(page: Page, appId: string) {
    await page.locator('#user-trigger').click();
    await page.locator(appId).click();
    await passSelectBu(page);
}

export async function logoutFromPortal(page: Page) {
    await page.locator('#user-trigger').click();
    await page.locator('#logout-button').click();
    await page.waitForSelector('text=Signed out', { timeout: 10000 });
}

export async function loginToPortal(page: Page, env: Environment, login: string, password: string, noPersistence: boolean = false) {
    let localUrl = '';
    let storageStateName = ''
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
    await page.goto(localUrl);
    await page.locator('//*[@id="identifierInput"]').fill(login);
    await page.getByTitle('Next').click();
    await page.locator('//*[@id="password"]').fill(password);
    await page.getByTitle('Sign on').click();
    if (!noPersistence){
        await page.context().storageState({path: storageStateName});
    }
}


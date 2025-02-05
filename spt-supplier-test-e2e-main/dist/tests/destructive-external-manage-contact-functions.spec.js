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
import { accessAppFromUserMenu, accessBaseUrl, createUrlRegex } from "./helpers/helper";
import { Environment } from "./helpers/environment";
import SELECTORS from "./selectors/selectors.json";
test.describe.configure({ mode: 'serial' });
test('admin can manage contact functions', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    const identity = yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.IDENTITY).textContent();
    const regex = /(?:Mr|Ms)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/;
    const match = identity.match(regex);
    const lastname = match[1];
    const firstname = match[2];
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_FUNCTION_BUTTON).click();
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-functions?bu=.*&contactId=.*`));
    yield expect(page.getByText(`${firstname} ${lastname}`)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.MANDATORY_ROW)).toHaveText('Mandatory');
    yield page.locator('input[type="checkbox"]').nth(0).setChecked(true);
    yield expect(page.locator('input[type="checkbox"]').nth(1)).toBeChecked();
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON).click();
    yield page.waitForResponse(resp => resp.url().includes('/bff-user/function/') && resp.status() === 201);
}));
function changeStateFunctionManagementSlider(functionManagementSlider, page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield functionManagementSlider.click();
        yield page.getByRole('button', { name: 'Confirm' }).click();
        yield page.waitForResponse(resp => resp.url().includes('/manage-function-by-supplier') && resp.status() === 200);
    });
}
test('edit functions by commercial code', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    yield handleActionOnFunctionManagementSlider(page);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_FUNCTION_BUTTON).click();
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-functions?bu=.*&contactId=.*`));
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.SELECT_ALL_CHECKBOX).nth(1).setChecked(true);
    const checkboxes = page.locator('#checkbox-table-functions input[type="checkbox"]');
    const allChecked = yield checkboxes.evaluateAll(checkboxes => checkboxes.every(checkbox => checkbox.checked));
    expect(allChecked).toBe(true);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON).click();
}));
function handleActionOnFunctionManagementSlider(page, isChecked = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const functionManagementSlider = page.locator(SELECTORS.EXTERNAL.MY_TEAM.SLIDER.FUNCTION_MANAGEMENT);
        const sliderClasses = yield functionManagementSlider.getAttribute('class');
        if (sliderClasses.includes('mat-checked') === isChecked) {
            yield changeStateFunctionManagementSlider(functionManagementSlider, page);
        }
        else {
            yield changeStateFunctionManagementSlider(functionManagementSlider, page);
            yield changeStateFunctionManagementSlider(functionManagementSlider, page);
        }
    });
}
test('edit functions for entire bu', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    yield handleActionOnFunctionManagementSlider(page, true);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_FUNCTION_BUTTON).click();
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-functions?bu=.*&contactId=.*`));
    yield page.locator('input[type="checkbox"]').nth(0).setChecked(true);
    const columns = page.locator('#checkbox-table-functions th');
    expect(yield columns.count()).toBe(2);
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON).click();
    yield page.waitForResponse(resp => resp.url().includes('/bff-user/function/') && resp.status() === 201);
}));
test('Go to manage access page as contact administrator', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield expect(page.getByText('Welcome on supplier portal')).toBeVisible();
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_ACCESS_BUTTON)).toContainText('MANAGE ACCESS');
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_ACCESS_BUTTON).click();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.UNDEFINED_TITLE)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON)).toBeVisible();
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.CANCEL_BUTTON)).toBeVisible();
}));
test('admin can manage contact accesses', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield accessBaseUrl(page, Environment.EXTERNAL);
    yield accessAppFromUserMenu(page, '#MY_TEAM');
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));
    const manageByEntity = yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.SLIDER.ACCESS_MANAGEMENT).isChecked();
    yield page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_ACCESS_BUTTON).click();
    yield expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-accesses?bu=.*&contactId=.*&userId=.*`));
    yield expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.ACCESS.WARNING_NOTIFICATION)).toBeVisible();
    const thCount = yield page.locator('#accesses-table th').count();
    if (manageByEntity) {
        expect(thCount).toBeGreaterThan(2);
    }
    else {
        expect(thCount).toEqual(2);
    }
}));

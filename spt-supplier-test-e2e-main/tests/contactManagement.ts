import { expect, Locator, Page, test } from '@playwright/test';
import { accessAppFromUserMenu, accessBaseUrl, createUrlRegex } from './helpers/helper';
import { Environment } from './helpers/environment';
import SELECTORS from './selectors/selectors.json';

test.describe('Gestion des fonctions de contact', () => {
    test('L\'admin peut gérer les fonctions d\'un contact', async ({ page }) => {
        await accessBaseUrl(page, Environment.EXTERNAL);
        await accessAppFromUserMenu(page, '#MY_TEAM');
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));

        const identity = await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.IDENTITY).textContent();

        if (!identity) {
            throw new Error('Le champ identity est vide ou introuvable.');
        }

        const regex = /(?:Mr|Ms)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)/;
        const match = identity.match(regex);

        if (!match) {
            throw new Error(`Le texte "${identity}" ne correspond pas au modèle attendu.`);
        }

        const lastname = match[1];
        const firstname = match[2];

        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_FUNCTION_BUTTON).click();
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-functions?bu=.*&contactId=.*`));
        await expect(page.getByText(`${firstname} ${lastname}`)).toBeVisible();
        await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.MANDATORY_ROW)).toHaveText('Mandatory');

        await page.locator('input[type="checkbox"]').nth(0).setChecked(true);
        await expect(page.locator('input[type="checkbox"]').nth(1)).toBeChecked();
        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON).click();

        await page.waitForResponse(resp => resp.url().includes('/bff-user/function/') && resp.status() === 201);
    });

    async function changeStateFunctionManagementSlider(functionManagementSlider: Locator, page: Page) {
        await functionManagementSlider.click();
        await page.getByRole('button', { name: 'Confirm' }).click();
        await page.waitForResponse(resp => resp.url().includes('/manage-function-by-supplier') && resp.status() === 200);
    }

    async function handleActionOnFunctionManagementSlider(page: Page, isChecked: boolean = false) {
        const functionManagementSlider = page.locator(SELECTORS.EXTERNAL.MY_TEAM.SLIDER.FUNCTION_MANAGEMENT);
        const sliderClasses = await functionManagementSlider.getAttribute('class');

        if (!sliderClasses) {
            throw new Error('Impossible de récupérer les classes du slider. Vérifiez que le sélecteur est correct.');
        }

        // Vérification de l'état du slider
        const isSliderChecked = sliderClasses.includes('mat-checked');
        if (isSliderChecked === isChecked) {
            // Pas de changement nécessaire
            return;
        }

        // Change l'état du slider
        await changeStateFunctionManagementSlider(functionManagementSlider, page);
    }


    test('Modification des fonctions par code commercial', async ({ page }) => {
        await accessBaseUrl(page, Environment.EXTERNAL);
        await accessAppFromUserMenu(page, '#MY_TEAM');
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));

        await handleActionOnFunctionManagementSlider(page);
        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_FUNCTION_BUTTON).click();
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-functions?bu=.*&contactId=.*`));

        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.SELECT_ALL_CHECKBOX).nth(1).setChecked(true);
        const checkboxes = page.locator('#checkbox-table-functions input[type="checkbox"]');
        const allChecked = await checkboxes.evaluateAll(checkboxes =>
            checkboxes.every(checkbox => (checkbox as HTMLInputElement).checked)
        );
        expect(allChecked).toBe(true);

        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON).click();
    });

    test('Modification des fonctions pour l\'ensemble de la BU', async ({ page }) => {
        await accessBaseUrl(page, Environment.EXTERNAL);
        await accessAppFromUserMenu(page, '#MY_TEAM');
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));

        await handleActionOnFunctionManagementSlider(page, true);
        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_FUNCTION_BUTTON).click();
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-functions?bu=.*&contactId=.*`));

        await page.locator('input[type="checkbox"]').nth(0).setChecked(true);
        const columns = page.locator('#checkbox-table-functions th');
        expect(await columns.count()).toBe(2);

        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON).click();
        await page.waitForResponse(resp => resp.url().includes('/bff-user/function/') && resp.status() === 201);
    });
});

test.describe('Gestion des accès de contact', () => {
    test('Accès à la page de gestion d\'accès en tant qu\'administrateur de contact', async ({ page }) => {
        await accessBaseUrl(page, Environment.EXTERNAL);
        await expect(page.getByText('Welcome on supplier portal')).toBeVisible();
        await accessAppFromUserMenu(page, '#MY_TEAM');
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));

        await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_ACCESS_BUTTON))
            .toContainText('MANAGE ACCESS');
        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_ACCESS_BUTTON).click();

        await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.UNDEFINED_TITLE)).toBeVisible();
        await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.VALIDATE_BUTTON)).toBeVisible();
        await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.MANAGE_FUNCTION.CANCEL_BUTTON)).toBeVisible();
    });

    test('L\'admin peut gérer les accès d\'un contact', async ({ page }) => {
        await accessBaseUrl(page, Environment.EXTERNAL);
        await accessAppFromUserMenu(page, '#MY_TEAM');
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/supplier-platform-core/.*/directory/contacts`));

        const manageByEntity = await page.locator(SELECTORS.EXTERNAL.MY_TEAM.SLIDER.ACCESS_MANAGEMENT).isChecked();
        await page.locator(SELECTORS.EXTERNAL.MY_TEAM.FIRST_CONTACT_ROW.MANAGE_ACCESS_BUTTON).click();
        await expect(page).toHaveURL(createUrlRegex(`${process.env.EXTERNAL_URL}/manage-contact/manage-accesses?bu=.*&contactId=.*&userId=.*`));

        await expect(page.locator(SELECTORS.EXTERNAL.MY_TEAM.ACCESS.WARNING_NOTIFICATION)).toBeVisible();
        const thCount = await page.locator('#accesses-table th').count();
        if (manageByEntity) {
            expect(thCount).toBeGreaterThan(2);
        } else {
            expect(thCount).toEqual(2);
        }
    });
});

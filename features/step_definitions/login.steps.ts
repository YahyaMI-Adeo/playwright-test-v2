// features/step_definitions/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect, chromium, Browser, Page } from '@playwright/test';
import { loginToPortal, accessAppFromUserMenu } from '../../tests/helpers/helper';
import { Environment } from '../../tests/helpers/environment';

let browser: Browser;
let page: Page;

// Scénario @AUT01 et @AUT02 : Internal - Authentication -
// "I am connected as "ADMIN_BU_INTERNAL" user on portal partner side"
Given(/^I am connected as "([^"]*)" user on portal partner side$/, async function (user: string) {
    // On lance le navigateur et ouvre une nouvelle page
    browser = await chromium.launch();
    page = await browser.newPage();
    const password = process.env.INTERNAL_PASSWORD || '';
    await loginToPortal(page, Environment.INTERNAL, user, password);
});

Given(/^I am connected as "([^"]*)" user with password "([^"]*)"$/, async function (user: string, password: string) {
    browser = await chromium.launch();
    page = await browser.newPage();
    // Ici, on suppose que pour les utilisateurs partenaires, on utilise l'environnement partenaire.
    await loginToPortal(page, Environment.PARTNER, user, password);
});

// Scénario @AUT04 : Partner - Authentication - No Passing Case - on portal internal side
Given(/^I am connected as "([^"]*)" user on portal internal side$/, async function (user: string) {
    browser = await chromium.launch();
    page = await browser.newPage();
    const password = process.env.INTERNAL_PASSWORD || '';
    await loginToPortal(page, Environment.INTERNAL, user, password);
});

// Pour le scénario où l'on simule l'absence de VPN
Given(/^I am not connected to the VPN$/, async function () {
    // Ici, vous pouvez simuler l'absence de VPN (par exemple en définissant une variable de contexte)
    console.log("VPN non connecté (simulation)");
});

// Étape commune : Lorsque je clique sur "home" button
When(/^I click on "([^"]*)" button$/, async function (buttonLabel: string) {
    await page.getByRole('button', { name: buttonLabel }).click();
});

// Étape commune : Error message is displayed
Then(/^Error message is displayed$/, async function () {
    // Ici, vous devez adapter le sélecteur à l'élément réel qui affiche le message d'erreur
    const errorMessageVisible = await page.locator('.error-message').isVisible();
    expect(errorMessageVisible).toBeTruthy();
});

// Étape commune : I am redirected to Ping authentication page
Then(/^I am redirected to Ping authentication page$/, async function () {
    const url = page.url();
    // Vérifiez ici le pattern réel de l'URL de la page Ping
    expect(url).toContain("ping");
});

// Étape commune : I am redirected to "Platform" page ou "Home" page, etc.
Then(/^I am redirected to "([^"]*)" page$/, async function (pageName: string) {
    const url = page.url();
    // On peut utiliser toLowerCase pour rendre la vérification insensible à la casse
    expect(url.toLowerCase()).toContain(pageName.toLowerCase());
});

// Pour le scénario où l'utilisateur accède à "My Team" depuis le menu utilisateur
When(/^I access to "([^"]*)" from user menu$/, async function (menuItem: string) {
    await accessAppFromUserMenu(page, menuItem);
});

// Pour vérifier que la dernière date de connexion correspond à aujourd'hui
Then(/^User last login date is today's date$/, async function () {
    const today = new Date().toLocaleDateString();
    // Adaptez le sélecteur à l'élément affichant la date de dernière connexion
    const loginDateElement = page.locator('.last-login-date');
    await loginDateElement.waitFor();
    const text = await loginDateElement.textContent();
    expect(text).toContain(today);
});

// Optionnel : fermeture du navigateur à la fin de chaque scénario
Then('I close the browser', async function () {
    await browser.close();
});

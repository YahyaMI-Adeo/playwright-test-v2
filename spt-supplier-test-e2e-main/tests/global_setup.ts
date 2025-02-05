import { chromium } from '@playwright/test';
import { loginToPortal } from "./helpers/helper";
import { Environment } from "./helpers/environment";
import fs from 'fs';

async function setupSession(env: Environment, username: string, password: string, filePath: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log(`Setting up session for ${env}...`);
        await loginToPortal(page, env, username, password);
        await page.context().storageState({ path: filePath });

        // Vérifier si le fichier d'état a bien été enregistré
        if (fs.existsSync(filePath)) {
            console.log(`✅ Session saved to ${filePath}`);
        } else {
            console.warn(`⚠️ Failed to save session state to ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error during setup for ${env}:`, error);
    } finally {
        await browser.close();
    }
}

async function globalSetup() {
    await Promise.all([
        setupSession(Environment.EXTERNAL, process.env.EXTERNAL_USERNAME, process.env.EXTERNAL_PASSWORD, 'auth-external.json'),
        setupSession(Environment.INTERNAL, process.env.INTERNAL_USERNAME, process.env.INTERNAL_PASSWORD, 'auth-internal.json')
    ]);
}

export default globalSetup;

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
export default defineConfig({
    globalSetup: require.resolve('./tests/global_setup'),
    timeout: 60000,
    expect: {
        timeout: 20000
    },
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    use: {
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry'
    },
    projects: [
        { name: 'internal-setup', testMatch: /.*-internal\.setup\.ts/ },
        { name: 'external-setup', testMatch: /.*-external\.setup\.ts/ },
        {
            name: 'google-chrome-external',
            use: Object.assign(Object.assign({}, devices['Desktop Chrome']), { channel: 'chrome', storageState: 'playwright/.auth-external/user.json' }),
            testMatch: /external-.*\.spec\.ts$/,
            grepInvert: /.*destructive-external.*\.spec\.ts/,
            dependencies: ['external-setup'],
        },
        {
            name: 'google-chrome-internal',
            use: Object.assign(Object.assign({}, devices['Desktop Chrome']), { channel: 'chrome', storageState: 'playwright/.auth-internal/user.json' }),
            testMatch: /internal-.*\.spec\.ts/,
            dependencies: ['internal-setup'],
        },
        {
            name: 'google-chrome-external-destructive',
            use: Object.assign(Object.assign({}, devices['Desktop Chrome']), { channel: 'chrome', storageState: 'playwright/.auth-external/user.json' }),
            testMatch: /destructive-external-.*\.spec\.ts$/,
            dependencies: ['external-setup'],
        }
    ]
});

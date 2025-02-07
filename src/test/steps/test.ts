// features/step_definitions/test.ts
import {Given} from '@cucumber/cucumber';
import {fixture} from "../../hooks/pageFixture";

Given('I am connected as {string} user on portal partner side', async function (user: string) {
    console.log('la bite');
    console.log(process.env.EXTERNAL_PASSWORD);
    await fixture.page.goto(process.env.EXTERNAL_URL);
    await fixture.page.waitForTimeout(5000);

    return 'mdr';
});

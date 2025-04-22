import { test, expect, type Page  } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/en';
import { ParabankRegister } from '../../src/pages/RegisterPage';
import { ParabankLogin } from '../../src/pages/LoginPage';
import { ParabankNavMenu } from '../../src/pages/NavigationMenu';

// test.beforeAll(async ({page}) => {
//   await page.goto('https://parabank.parasoft.com/');
// })

const username = faker.internet.username();
const password = faker.internet.password();

test.describe('UI end-to-end test for Parabank', () => {
  test('register new user', async ({ page }) => {
    const parabankRegister = new ParabankRegister(page);
    const parabankLogin = new ParabankLogin(page);
    const parabankNavMenu = new ParabankNavMenu(page);

    await parabankRegister.goToURL();
    await parabankRegister.registerUser(username, password);
    await logout(page);
    
    await parabankLogin.login(username, password);

    await parabankNavMenu.verifyNavMenuRelogin(username, password);
  });


//create savings account; capture account number
//end

//verify balance details in accounts overview page
//end

//transfer funds from savings to other account
//end

//pay bill from savings
//end

});

async function logout(page: Page) {
  const logoutLink = page.getByRole('link', {name: 'Log Out'});
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();
  await expect(page.getByRole('heading', {name: 'Customer Login'})).toBeVisible;
}



import { test } from './fixtures';
import { expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/en';
import { Register } from '../../src/pages/RegisterPage';
import { Login } from '../../src/pages/LoginPage';
import { NavMenu } from '../../src/pages/NavigationMenu';
import { OpenAccount } from '../../src/pages/OpenAccountPage';
import { AccountsOverview } from '../../src/pages/AccountsOverviewPage';
import { TransferFunds } from '../../src/pages/TransferFundsPage';
import { BillPay } from '../../src/pages/BillPayPage';

// test.beforeEach(async ({page}) => {
//   await page.goto('https://parabank.parasoft.com/');
// })

//only added test data here that needs to be reused multiple times in respect of time
let testData = {
  username: faker.internet.username(),
  password: faker.internet.password(),
  accountIdInitial: '',
  accountIdSavings: '',
  accountBalInitial: '',
  accountBalSavings: '',
  transferAmount: '10',
  billPayAmount: '50'
};

test.describe('Parabank UI End-to-end Test', () => {
  test('register > login > open account > transfer > pay', async ({ page }) => {
    const register = new Register(page);

    await register.goToURL();
    await register.registerUser(testData.username, testData.password);
    testData.accountIdInitial = await register.getAccountNumber();
    testData.accountBalInitial = await register.getAccountBalance(testData.accountIdInitial);
    await logout(page);

    const login = new Login(page);
    await login.login(testData.username, testData.password);

    const navMenu = new NavMenu(page);
    await navMenu.verifyNavMenuRelogin(testData.username, testData.password);

    const openAccount = new OpenAccount(page);
    testData.accountIdSavings = await openAccount.createNewSavingsAccount();
    testData.accountBalSavings = await openAccount.getAccountBalance(testData.accountIdSavings);

    const accountsOverview = new AccountsOverview(page);
    const newInitialBalance = await calculateNewBalance(testData.accountBalInitial, testData.accountBalSavings);
    await accountsOverview.validateBalanceDetails(testData.accountIdInitial, newInitialBalance);
    await accountsOverview.validateBalanceDetails(testData.accountIdSavings, testData.accountBalSavings); 

    const transferFunds = new TransferFunds(page);
    await transferFunds.transferFunds(testData.accountIdSavings, testData.accountIdInitial, testData.transferAmount);
    await transferFunds.verifyTransferBothAccounts(testData.accountIdSavings, testData.accountIdInitial, testData.transferAmount);

    const billPay = new BillPay(page);
    await billPay.createBillPay(testData.accountIdSavings, testData.billPayAmount);
    await billPay.verifyBillPayment(testData.accountIdSavings, testData.billPayAmount);
  });

});

test.describe('Parabank API Test', () => {
  const baseURL = 'https://parabank.parasoft.com';
  test('find transaction by payment amount', async ({ request }) => {
    const loginResponse = await request.post(`${baseURL}/parabank/login.htm`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': baseURL
      },
      form: {
        'username': testData.username,
        'password': testData.password
      }
    });

    const cookies = loginResponse.headers()['set-cookie'];
    const sessionCookie = cookies?.[0]?.split(';')[0];
    const response = await request.get(
      `${baseURL}/parabank/services_proxy/bank/accounts/${testData.accountIdSavings}/transactions/amount/${testData.billPayAmount}`, {
      headers: {
        'Accept': '*/*',
        'Cookie': sessionCookie,
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `${baseURL}/parabank/findtrans.htm`
      },
      params: {
        'timeout': '30000'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
    
    if (responseBody.length > 0) {
      const transaction = responseBody[0];
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('accountId');
      expect(transaction).toHaveProperty('amount');
      expect(parseFloat(transaction.amount)).toEqual(parseFloat(testData.billPayAmount));
    }
  });

});

async function logout(page: Page) {
  const logoutLink = page.getByRole('link', {name: 'Log Out'});
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();
  await expect(page.getByRole('heading', {name: 'Customer Login'})).toBeVisible;
}

async function calculateNewBalance(initialBalance: string, amountToSubtract: string): Promise<string> {
  const initial = parseFloat(initialBalance.replace('$', ''));
  const subtract = parseFloat(amountToSubtract.replace('$', ''));
  
  const newBalance = (initial - subtract).toFixed(2);
  
  return `$${newBalance}`;
}



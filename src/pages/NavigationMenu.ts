import { type Locator, type Page, expect } from '@playwright/test';
import { ParabankLogin } from './LoginPage';

export class ParabankNavMenu {
    readonly page: Page;
    readonly openAccountLink: Locator;
    readonly accountsOverviewLink: Locator;
    readonly transferFundsLink: Locator;
    readonly billPayLink: Locator;
    readonly findTransactionsLink: Locator;
    readonly updateContactInfoLink: Locator;
    readonly requestLoanLink: Locator;
    readonly logOutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openAccountLink = page.getByRole('link', { name: 'Open New Account' });
        this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview' });
        this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
        this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
        this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });
        this.updateContactInfoLink = page.getByRole('link', { name: 'Update Contact Info' });
        this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
        this.logOutLink = page.getByRole('link', { name: 'Log Out' });
      }

        async verifyNavMenuRelogin(username:string, password:string) {
            await this.openAccountLink.click();
            await expect(this.page.getByRole('heading', { name: 'Open New Account' })).toBeVisible();
            await this.accountsOverviewLink.click();
            await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
            await this.transferFundsLink.click();
            await expect(this.page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible();
            await this.billPayLink.click();
            await expect(this.page.getByRole('heading', { name: 'Bill Payment Service' })).toBeVisible();
            await this.findTransactionsLink.click();
            await expect(this.page.getByRole('heading', { name: 'Find Transactions' })).toBeVisible();
            await this.updateContactInfoLink.click();
            await expect(this.page.getByRole('heading', { name: 'Update Profile' })).toBeVisible();
            await this.requestLoanLink.click();
            await expect(this.page.getByRole('heading', { name: 'Apply for a Loan' })).toBeVisible();
            await this.logOutLink.click();
            await expect(this.page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
            const loginPage = new ParabankLogin(this.page);
            await loginPage.login(username, password);
        }
}
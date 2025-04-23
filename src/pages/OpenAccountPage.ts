import { type Locator, type Page, expect } from '@playwright/test';
import { NavMenu } from './NavigationMenu';

export class OpenAccount {
    readonly page: Page;
    readonly accountType: Locator;
    readonly fromAccountId: Locator;
    readonly openAccountButton: Locator;
    readonly accountId: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountType = page.locator('#type');
        this.fromAccountId = page.locator('#fromAccountId');
        this.openAccountButton = page.getByRole('button', { name: 'Open New Account' });
        this.accountId = page.locator('#newAccountId');
    }

    async createNewSavingsAccount(): Promise<string> {
        const navMenu = new NavMenu(this.page);
        await navMenu.openAccountLink.click();
        await expect(this.page.getByRole('heading', { name: 'Open New Account' })).toBeVisible();
        await this.accountType.selectOption('SAVINGS');
        await this.fromAccountId.selectOption({index: 0});
        await this.openAccountButton.click();
        await expect(this.page.getByText('Congratulations, your account is now open.')).toBeVisible();
        const newAccountId = await this.accountId.innerText();
        return newAccountId;
    }

      async getAccountBalance(accountId:string): Promise<string> {
        const navMenu = new NavMenu(this.page);
        await navMenu.accountsOverviewLink.click();
        const accountBalanceSavings = await this.page.locator(`xpath=//a[contains(text(),"${accountId}")]//parent::td//following-sibling::td`).first().innerText();
        return accountBalanceSavings;
      }
}
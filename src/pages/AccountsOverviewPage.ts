import { type Locator, type Page, expect } from '@playwright/test';
import { NavMenu } from './NavigationMenu';

export class AccountsOverview {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async validateBalanceDetails(accountNumber: string, balance: string): Promise<void> {
        const navMenu = new NavMenu(this.page);
        await navMenu.accountsOverviewLink.click();
        await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
        const accountDetails = this.page.locator(`text=${accountNumber}`).locator('xpath=..//following-sibling::td[2]');
        const accountBalance = await accountDetails.innerText();
        expect(accountBalance).toContain(balance);
    }
}
import { type Locator, type Page, expect } from '@playwright/test';
import { NavMenu } from './NavigationMenu';

export class TransferFunds {
    readonly page: Page;
    readonly fromAccountDropdown: Locator;
    readonly toAccountDropdown: Locator;
    readonly amountTextbox: Locator;
    readonly transferButton: Locator;
    readonly amountSentValue: Locator;
    readonly amountReceivedValue: Locator;    

    constructor(page: Page) {
        this.page = page;
        this.fromAccountDropdown = page.locator('#fromAccountId');
        this.toAccountDropdown = page.locator('#toAccountId');
        this.amountTextbox = page.locator('#amount');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.amountSentValue = page.locator(`xpath=//a[contains(text(),"Funds Transfer Sent")]//parent::td//following-sibling::td`);
        this.amountReceivedValue = page.locator(`xpath=//a[contains(text(),"Funds Transfer Received")]//parent::td//following-sibling::td`);
    }
    async transferFunds(fromAccount: string, toAccount: string, amount: string): Promise<void> {  
        const navMenu = new NavMenu(this.page);
        await navMenu.transferFundsLink.click();
        await expect(this.page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible();
        await this.fromAccountDropdown.selectOption(fromAccount);
        await this.toAccountDropdown.selectOption(toAccount);
        await this.amountTextbox.fill(amount);
        await this.transferButton.click();
        await expect(this.page.getByRole('heading', {name: 'Transfer Complete!'})).toBeVisible();
    }
    async verifyTransferBothAccounts(fromAccount: string, toAccount: string, amount: string): Promise<void> {
        const navMenu = new NavMenu(this.page);
        await navMenu.accountsOverviewLink.click();
        await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
        await this.page.locator(`text=${fromAccount}`).click();
        const fromAccountBalanceSentValue = await this.amountSentValue.first().innerText();
        await navMenu.accountsOverviewLink.click();
        await this.page.locator(`text=${toAccount}`).click();
        const toAccountBalanceReceivedValue = await this.amountReceivedValue.last().innerText();
        expect(fromAccountBalanceSentValue).toContain(amount);
        expect(toAccountBalanceReceivedValue).toContain(amount);
    }
}

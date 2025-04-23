import { type Locator, type Page, expect } from '@playwright/test';
import { NavMenu } from './NavigationMenu';

export class BillPay {
    readonly page: Page;
    readonly payeeNameTextbox: Locator;
    readonly addressTextbox: Locator;
    readonly cityTextbox: Locator;
    readonly stateTextbox: Locator;
    readonly zipCodeTextbox: Locator;
    readonly phoneNumberTextbox: Locator;
    readonly accountNumberTextbox: Locator;
    readonly verifyAccountNumTextbox: Locator;
    readonly amountTextbox: Locator;
    readonly fromAccountDropdown: Locator;
    readonly sendPaymentButton: Locator;
    readonly amountPayedValue: Locator;

    constructor(page: Page) {
        this.page = page;
        this.payeeNameTextbox = page.locator('[name="payee.name"]');
        this.addressTextbox = page.locator('[name="payee.address.street"]');
        this.cityTextbox = page.locator('[name="payee.address.city"]');
        this.stateTextbox = page.locator('[name="payee.address.state"]');
        this.zipCodeTextbox = page.locator('[name="payee.address.zipCode"]');
        this.phoneNumberTextbox = page.locator('[name="payee.phoneNumber"]');
        this.accountNumberTextbox = page.locator('[name="payee.accountNumber"]');
        this.verifyAccountNumTextbox = page.locator('[name="verifyAccount"]');
        this.amountTextbox = page.locator('[name="amount"]');
        this.fromAccountDropdown = page.locator('[name="fromAccountId"]');
        this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
        this.amountPayedValue = page.locator(`xpath=//a[contains(text(),"Bill Payment")]//parent::td//following-sibling::td`);
    }

    async createBillPay(fromAccount: string, amount: string){
        const navMenu = new NavMenu(this.page);
        await navMenu.billPayLink.click();
        await expect(this.page.getByRole('heading', { name: 'Bill Pay' })).toBeVisible();
        await this.payeeNameTextbox.fill('GCash');
        await this.addressTextbox.fill('Ayala Avenue');
        await this.cityTextbox.fill('Makati');
        await this.stateTextbox.fill('Metro Manila');
        await this.zipCodeTextbox.fill('1289');
        await this.phoneNumberTextbox.fill('09087654321');
        await this.accountNumberTextbox.fill('987123654');
        await this.verifyAccountNumTextbox.fill('987123654');
        await this.amountTextbox.fill(amount);
        await this.fromAccountDropdown.selectOption(fromAccount);
        await expect(this.sendPaymentButton).toBeEnabled();
        await this.sendPaymentButton.click({force:true});
        await expect(this.page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
    }

    async verifyBillPayment(fromAccount: string, amount: string): Promise<void> {
        const navMenu = new NavMenu(this.page);
        await navMenu.accountsOverviewLink.click();
        await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
        await this.page.locator(`text=${fromAccount}`).click();
        const accountPayedVal = await this.amountPayedValue.first().innerText();
        expect(accountPayedVal).toContain(amount);
    }

}
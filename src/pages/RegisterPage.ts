import { type Locator, type Page, expect } from '@playwright/test';
import { NavMenu } from './NavigationMenu';

export class Register {
    readonly page: Page;
    readonly registerLink: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly addressTextbox: Locator;
    readonly cityTextbox: Locator;
    readonly stateTextbox: Locator;
    readonly zipCodeTextbox: Locator;
    readonly phoneNumberTextbox: Locator;
    readonly ssnTextbox: Locator;
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly confirmPasswordTextbox: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.firstNameTextbox = page.locator('[id="customer.firstName"]');
        this.lastNameTextbox = page.locator('[id="customer.lastName"]');
        this.addressTextbox = page.locator('[id="customer.address.street"]');
        this.cityTextbox = page.locator('[id="customer.address.city"]');
        this.stateTextbox = page.locator('[id="customer.address.state"]');
        this.zipCodeTextbox = page.locator('[id="customer.address.zipCode"]');
        this.phoneNumberTextbox = page.locator('[id="customer.phoneNumber"]');
        this.ssnTextbox = page.locator('[id="customer.ssn"]');
        this.usernameTextbox = page.locator('[id="customer.username"]');
        this.passwordTextbox = page.locator('[id="customer.password"]');
        this.confirmPasswordTextbox = page.locator('#repeatedPassword');
        this.registerButton = page.getByRole('button', { name: 'Register' });
      }

      async goToURL(){
        await this.page.goto('https://parabank.parasoft.com/');
      }
 
      async registerUser(username:string, password:string) {
        await this.registerLink.click({ force: true });
        await this.firstNameTextbox.fill('Ana');
        await this.lastNameTextbox.fill('Pereira');
        await this.addressTextbox.fill('Maxville Avenue');
        await this.cityTextbox.fill('Tagaytay');
        await this.stateTextbox.fill('Batangas');
        await this.zipCodeTextbox.fill('1708');
        await this.phoneNumberTextbox.fill('09067894561');
        await this.ssnTextbox.fill('456789123');
        await this.usernameTextbox.fill(username);
        await this.passwordTextbox.fill(password);
        await this.confirmPasswordTextbox.fill(password);
        await this.registerButton.click();
        await expect(this.page.locator('#rightPanel')).toContainText('Your account was created successfully. You are now logged in.');
      }
      
      async getAccountNumber(): Promise<string> {
        const navMenu = new NavMenu(this.page);
        await navMenu.accountsOverviewLink.click();
        const accountNumber = await this.page.locator('xpath=//td/a').innerText();
        return accountNumber;
      }

      async getAccountBalance(accountNumber:string): Promise<string> {
        const navMenu = new NavMenu(this.page);
        await navMenu.accountsOverviewLink.click({force:true});
        const accountBalance = await this.page.locator(`xpath=//a[contains(text(),"${accountNumber}")]//parent::td//following-sibling::td`).first().innerText();
        return accountBalance.trim();
      }
      
}
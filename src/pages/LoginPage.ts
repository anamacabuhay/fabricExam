import { type Locator, type Page, expect } from '@playwright/test';

export class Login {
    readonly page: Page;
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameTextbox = page.locator('[name="username"]');
        this.passwordTextbox = page.locator('[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Log In' });
      }

      async login(username:string, password:string) {
        await this.usernameTextbox.fill(username);
        await this.passwordTextbox.fill(password);
        await this.loginButton.click();
        await expect(this.page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
      }

    }
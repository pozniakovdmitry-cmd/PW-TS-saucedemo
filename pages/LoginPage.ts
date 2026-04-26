import {Page, Locator } from '@playwright/test'
import { InventoryPage } from './InventoryPage'

export class LoginPage {
    readonly page: Page
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly errorMessage: Locator

    constructor(page1: Page) {
        this.page = page1
        this.usernameInput = page1.locator('[data-test="username"]')
        this.passwordInput = page1.locator('[data-test="password"]')
        this.loginButton = page1.locator('[data-test="login-button"]')
        this.errorMessage = page1.locator('[data-test="error"]')
    }

    async goto() {
        await this.page.goto('/')
    }

    async login(username: string, password: string): Promise<InventoryPage> {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
        return new InventoryPage(this.page)
    }
}



//export class LoginPage {
    //readonly page: Page

  //  constructor(pageOO: Page) {
   //     this.page = pageOO
   // }
    // 2. напиши constructor который принимает page и сохраняет в this.page
//}
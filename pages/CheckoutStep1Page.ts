import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { CheckoutStep2Page } from './CheckoutStep2Page'

export class CheckoutStep1Page {
    readonly page: Page
    readonly title: Locator
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly postalCodeInput: Locator
    readonly continueButton: Locator
    readonly cancelButton: Locator
    readonly errorMessage: Locator
    readonly errorButton: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.locator('[data-test="title"]')
        this.firstNameInput = page.locator('[data-test="firstName"]')
        this.lastNameInput = page.locator('[data-test="lastName"]')
        this.postalCodeInput = page.locator('[data-test="postalCode"]')
        this.continueButton = page.locator('[data-test="continue"]')
        this.cancelButton = page.locator('[data-test="cancel"]')
        this.errorMessage = page.locator('[data-test="error"]')
        this.errorButton = page.locator('[data-test="error-button"]')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')
        await expect(this.title).toHaveText('Checkout: Your Information')
    }

    async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<CheckoutStep2Page> {
        await this.firstNameInput.fill(firstName)
        await this.lastNameInput.fill(lastName)
        await this.postalCodeInput.fill(postalCode)
        await this.continueButton.click()
        return new CheckoutStep2Page(this.page)
    }
}

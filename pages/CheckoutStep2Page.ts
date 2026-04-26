import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { CheckoutCompletePage } from './CheckoutCompletePage'

export class CheckoutStep2Page {
    readonly page: Page
    readonly title: Locator
    readonly cartItems: Locator
    readonly subtotalLabel: Locator
    readonly taxLabel: Locator
    readonly totalLabel: Locator
    readonly finishButton: Locator
    readonly cancelButton: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.locator('[data-test="title"]')
        this.cartItems = page.locator('.cart_item')
        this.subtotalLabel = page.locator('[data-test="subtotal-label"]')
        this.taxLabel = page.locator('[data-test="tax-label"]')
        this.totalLabel = page.locator('[data-test="total-label"]')
        this.finishButton = page.locator('[data-test="finish"]')
        this.cancelButton = page.locator('[data-test="cancel"]')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html')
        await expect(this.title).toHaveText('Checkout: Overview')
    }

    async finish(): Promise<CheckoutCompletePage> {
        await this.finishButton.click()
        return new CheckoutCompletePage(this.page)
    }
}

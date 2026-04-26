import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class CheckoutCompletePage {
    readonly page: Page
    readonly title: Locator
    readonly completeHeader: Locator
    readonly completeText: Locator
    readonly ponyExpress: Locator
    readonly backToProductsButton: Locator
    readonly cartBadge: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.locator('[data-test="title"]')
        this.completeHeader = page.locator('[data-test="complete-header"]')
        this.completeText = page.locator('[data-test="complete-text"]')
        this.ponyExpress = page.locator('[data-test="pony-express"]')
        this.backToProductsButton = page.locator('[data-test="back-to-products"]')
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html')
        await expect(this.title).toHaveText('Checkout: Complete!')
        await expect(this.completeHeader).toHaveText('Thank you for your order!')
    }
}

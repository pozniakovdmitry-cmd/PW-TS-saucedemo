import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class CartPage {
    readonly page: Page
    readonly title: Locator
    readonly cartItems: Locator
    readonly cartBadge: Locator
    readonly continueShoppingButton: Locator
    readonly checkoutButton: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.locator('[data-test="title"]')
        this.cartItems = page.locator('.cart_item')
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]')
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]')
        this.checkoutButton = page.locator('[data-test="checkout"]')
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com/cart.html')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html')
        await expect(this.title).toHaveText('Your Cart')
    }
}

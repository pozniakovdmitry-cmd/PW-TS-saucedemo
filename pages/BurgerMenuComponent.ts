import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class BurgerMenuComponent {
    readonly page: Page
    readonly openButton: Locator
    readonly closeButton: Locator
    readonly allItemsLink: Locator
    readonly aboutLink: Locator
    readonly logoutLink: Locator
    readonly resetLink: Locator

    constructor(page: Page) {
        this.page = page
        this.openButton = page.locator('#react-burger-menu-btn')
        this.closeButton = page.locator('#react-burger-cross-btn')
        this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]')
        this.aboutLink = page.locator('[data-test="about-sidebar-link"]')
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]')
        this.resetLink = page.locator('[data-test="reset-sidebar-link"]')
    }

    async open() {
        await this.openButton.click()
    }

    async close() {
        await this.closeButton.click()
    }
}

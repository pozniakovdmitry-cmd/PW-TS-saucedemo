import { Page, Locator} from '@playwright/test'
import { expect } from '@playwright/test'


export class InventoryPage {
    readonly page: Page
    readonly title: Locator
    readonly inventoryList: Locator

    constructor(page: Page) {
        this.page = page
        this.title= page.locator('[data-test="title"]')
        this.inventoryList = page.locator('.inventory_list')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html')
        await expect(this.title).toHaveText('Products')
        await expect(this.inventoryList).toBeVisible()
    }
}
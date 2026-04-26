import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('inventory page displays exactly six products', async ({ page }) => {
    await expect(page.locator('.inventory_item')).toHaveCount(6)
})

test('each product card shows name, description, price, image and Add to cart button', async ({ page }) => {
    const firstCard = page.locator('.inventory_item').first()
    await expect(firstCard.locator('.inventory_item_name')).toBeVisible()
    await expect(firstCard.locator('.inventory_item_desc')).toBeVisible()
    await expect(firstCard.locator('.inventory_item_price')).toBeVisible()
    await expect(firstCard.locator('.inventory_item_img img')).toBeVisible()
    await expect(firstCard.getByRole('button', { name: 'Add to cart' })).toBeVisible()
})

test('product images are not broken', async ({ page }) => {
    const images = page.locator('.inventory_item_img img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
        const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
    }
})

test('clicking product name navigates to detail page', async ({ page }) => {
    const firstName = await page.locator('.inventory_item_name').first().textContent()
    await page.locator('.inventory_item_name').first().click()

    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/)
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(firstName!)
})

test('clicking product image navigates to detail page', async ({ page }) => {
    await page.locator('.inventory_item_img img').first().click()
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/)
})

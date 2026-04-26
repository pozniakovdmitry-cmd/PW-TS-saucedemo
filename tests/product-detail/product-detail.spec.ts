import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await page.locator('.inventory_item_name').first().click()
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=\d+/)
})

test('product detail page displays all required fields', async ({ page }) => {
    await expect(page.locator('[data-test="inventory-item-name"]')).toBeVisible()
    await expect(page.locator('[data-test="inventory-item-desc"]')).toBeVisible()
    await expect(page.locator('[data-test="inventory-item-price"]')).toBeVisible()
    await expect(page.locator('.inventory_details_img')).toBeVisible()
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible()
})

test('back to products button returns to inventory', async ({ page }) => {
    await page.locator('[data-test="back-to-products"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    await expect(page.locator('.inventory_list')).toBeVisible()
})

test('add to cart from detail page increments cart badge', async ({ page }) => {
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
    await page.locator('[data-test="add-to-cart"]').click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
})

test('remove from cart on detail page clears cart badge', async ({ page }) => {
    await page.locator('[data-test="add-to-cart"]').click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')

    await page.locator('[data-test="remove"]').click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
})

test('product detail price matches inventory page price', async ({ page }) => {
    await page.locator('[data-test="back-to-products"]').click()
    const inventoryPrice = await page.locator('.inventory_item_price').first().textContent()
    await page.locator('.inventory_item_name').first().click()
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(inventoryPrice!)
})

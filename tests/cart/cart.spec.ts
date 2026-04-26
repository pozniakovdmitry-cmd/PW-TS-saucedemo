import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { CartPage } from '../../pages/CartPage'

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('add a single item increments cart badge to 1', async ({ page }) => {
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
})

test('add multiple items shows correct badge count', async ({ page }) => {
    await page.locator('.inventory_item').nth(0).getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    await page.locator('.inventory_item').nth(1).getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2')
    await page.locator('.inventory_item').nth(2).getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3')
})

test('remove item from inventory updates cart badge', async ({ page }) => {
    await page.locator('.inventory_item').nth(0).getByRole('button', { name: 'Add to cart' }).click()
    await page.locator('.inventory_item').nth(1).getByRole('button', { name: 'Add to cart' }).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2')

    await page.locator('.inventory_item').nth(0).getByRole('button', { name: 'Remove' }).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
})

test('cart page lists added items with correct details', async ({ page }) => {
    const firstItem = page.locator('.inventory_item').nth(0)
    const secondItem = page.locator('.inventory_item').nth(1)
    const firstName = await firstItem.locator('.inventory_item_name').textContent()
    const firstPrice = await firstItem.locator('.inventory_item_price').textContent()
    const secondName = await secondItem.locator('.inventory_item_name').textContent()

    await firstItem.getByRole('button', { name: 'Add to cart' }).click()
    await secondItem.getByRole('button', { name: 'Add to cart' }).click()

    const cartPage = new CartPage(page)
    await cartPage.goto()
    await cartPage.expectLoaded()

    await expect(cartPage.cartItems).toHaveCount(2)
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText(firstName!)
    await expect(page.locator('[data-test="inventory-item-price"]').first()).toHaveText(firstPrice!)
    await expect(page.locator('[data-test="inventory-item-name"]').nth(1)).toHaveText(secondName!)
})

test('remove item from cart page decrements badge', async ({ page }) => {
    await page.locator('.inventory_item').nth(0).getByRole('button', { name: 'Add to cart' }).click()
    await page.locator('.inventory_item').nth(1).getByRole('button', { name: 'Add to cart' }).click()

    const cartPage = new CartPage(page)
    await cartPage.goto()
    await expect(cartPage.cartItems).toHaveCount(2)

    await page.locator('[data-test^="remove-"]').first().click()
    await expect(cartPage.cartItems).toHaveCount(1)
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
})

test('continue shopping returns to inventory', async ({ page }) => {
    const cartPage = new CartPage(page)
    await cartPage.goto()
    await cartPage.continueShoppingButton.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('cart is empty when no items added', async ({ page }) => {
    const cartPage = new CartPage(page)
    await cartPage.goto()
    await expect(cartPage.cartItems).toHaveCount(0)
    await expect(cartPage.cartBadge).not.toBeVisible()
})

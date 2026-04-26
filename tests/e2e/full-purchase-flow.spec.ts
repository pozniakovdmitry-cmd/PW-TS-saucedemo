import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test('complete purchase of single item from inventory to confirmation', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')

    await page.locator('[data-test="shopping-cart-link"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')
    await expect(page.locator('.cart_item')).toHaveCount(1)

    await page.locator('[data-test="checkout"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')

    await page.locator('[data-test="firstName"]').fill('Jane')
    await page.locator('[data-test="lastName"]').fill('Doe')
    await page.locator('[data-test="postalCode"]').fill('10001')
    await page.locator('[data-test="continue"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html')

    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible()
    await expect(page.locator('[data-test="tax-label"]')).toBeVisible()
    await expect(page.locator('[data-test="total-label"]')).toBeVisible()

    await page.locator('[data-test="finish"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html')
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!')
})

test('complete purchase of all six items', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')

    const items = page.locator('.inventory_item')
    const count = await items.count()
    for (let i = 0; i < count; i++) {
        await items.nth(i).getByRole('button', { name: 'Add to cart' }).click()
    }
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('6')

    const priceTexts = await page.locator('.inventory_item_price').allTextContents()
    const expectedSubtotal = priceTexts
        .map(p => parseFloat(p.replace('$', '')))
        .reduce((sum, price) => sum + price, 0)

    await page.locator('[data-test="shopping-cart-link"]').click()
    await expect(page.locator('.cart_item')).toHaveCount(6)

    await page.locator('[data-test="checkout"]').click()
    await page.locator('[data-test="firstName"]').fill('Jane')
    await page.locator('[data-test="lastName"]').fill('Doe')
    await page.locator('[data-test="postalCode"]').fill('10001')
    await page.locator('[data-test="continue"]').click()

    await expect(page.locator('.cart_item')).toHaveCount(6)
    const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent()
    const actualSubtotal = parseFloat(subtotalText!.replace(/[^0-9.]/g, ''))
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2)

    await page.locator('[data-test="finish"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html')
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!')
})

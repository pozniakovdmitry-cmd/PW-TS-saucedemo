import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { CheckoutStep2Page } from '../../pages/CheckoutStep2Page'

async function goToCheckoutStep2(page: any, itemSelectors: string[] = ['[data-test="add-to-cart-sauce-labs-backpack"]']) {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    for (const selector of itemSelectors) {
        await page.locator(selector).click()
    }
    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
    await page.locator('[data-test="firstName"]').fill('Jane')
    await page.locator('[data-test="lastName"]').fill('Smith')
    await page.locator('[data-test="postalCode"]').fill('90210')
    await page.locator('[data-test="continue"]').click()
}

test('order overview shows correct items and totals', async ({ page }) => {
    await goToCheckoutStep2(page)
    const step2 = new CheckoutStep2Page(page)
    await step2.expectLoaded()

    await expect(step2.cartItems).toHaveCount(1)
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await expect(step2.subtotalLabel).toContainText('29.99')
    await expect(step2.taxLabel).toBeVisible()
    await expect(step2.totalLabel).toBeVisible()
})

test('cancel on step 2 returns to inventory', async ({ page }) => {
    await goToCheckoutStep2(page)
    const step2 = new CheckoutStep2Page(page)
    await step2.cancelButton.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('finish button completes the order', async ({ page }) => {
    await goToCheckoutStep2(page)
    const step2 = new CheckoutStep2Page(page)
    await step2.finishButton.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html')
})

test('overview shows correct item count for multiple products', async ({ page }) => {
    await goToCheckoutStep2(page, [
        '[data-test="add-to-cart-sauce-labs-backpack"]',
        '[data-test="add-to-cart-sauce-labs-bike-light"]',
        '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]'
    ])
    const step2 = new CheckoutStep2Page(page)
    await step2.expectLoaded()
    await expect(step2.cartItems).toHaveCount(3)
})

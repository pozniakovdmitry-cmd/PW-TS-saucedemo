import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage'

async function completeOrder(page: any) {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
    await page.locator('[data-test="firstName"]').fill('Jane')
    await page.locator('[data-test="lastName"]').fill('Doe')
    await page.locator('[data-test="postalCode"]').fill('10001')
    await page.locator('[data-test="continue"]').click()
    await page.locator('[data-test="finish"]').click()
}

test('order complete page shows confirmation', async ({ page }) => {
    await completeOrder(page)
    const completePage = new CheckoutCompletePage(page)
    await completePage.expectLoaded()
    await expect(completePage.completeText).toBeVisible()
    await expect(completePage.ponyExpress).toBeVisible()
})

test('back home button returns to inventory', async ({ page }) => {
    await completeOrder(page)
    const completePage = new CheckoutCompletePage(page)
    await completePage.backToProductsButton.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    await expect(page.locator('.inventory_list')).toBeVisible()
})

test('cart badge is cleared after completing order', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await page.locator('[data-test^="add-to-cart-"]').nth(0).click()
    await page.locator('[data-test^="add-to-cart-"]').nth(1).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2')

    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
    await page.locator('[data-test="firstName"]').fill('Jane')
    await page.locator('[data-test="lastName"]').fill('Doe')
    await page.locator('[data-test="postalCode"]').fill('10001')
    await page.locator('[data-test="continue"]').click()
    await page.locator('[data-test="finish"]').click()

    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
})

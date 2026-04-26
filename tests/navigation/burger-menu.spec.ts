import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { BurgerMenuComponent } from '../../pages/BurgerMenuComponent'

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('burger menu opens and shows all expected links', async ({ page }) => {
    const menu = new BurgerMenuComponent(page)
    await menu.open()
    await expect(menu.allItemsLink).toBeVisible()
    await expect(menu.aboutLink).toBeVisible()
    await expect(menu.logoutLink).toBeVisible()
    await expect(menu.resetLink).toBeVisible()
})

test('burger menu can be closed without taking action', async ({ page }) => {
    const menu = new BurgerMenuComponent(page)
    await menu.open()
    await menu.close()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('All Items link navigates to inventory', async ({ page }) => {
    await page.locator('[data-test="shopping-cart-link"]').click()
    const menu = new BurgerMenuComponent(page)
    await menu.open()
    await menu.allItemsLink.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('About link navigates to Sauce Labs website', async ({ page }) => {
    const menu = new BurgerMenuComponent(page)
    await menu.open()
    await menu.aboutLink.click()
    await expect(page).toHaveURL(/saucelabs\.com/)
})

test('Logout navigates back to login page', async ({ page }) => {
    const menu = new BurgerMenuComponent(page)
    await menu.open()
    await menu.logoutLink.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/')
    await expect(page.locator('[data-test="login-button"]')).toBeVisible()
})

test('Reset App State clears the cart', async ({ page }) => {
    await page.locator('[data-test^="add-to-cart-"]').nth(0).click()
    await page.locator('[data-test^="add-to-cart-"]').nth(1).click()
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2')

    const menu = new BurgerMenuComponent(page)
    await menu.open()
    await menu.resetLink.click()
    await menu.close()

    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Add to cart' }).first()).toBeVisible()
})

import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'

test('successful login with POM', async ({ page }) => {
    const loginPage = new LoginPage(page)


    await loginPage.goto()
    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce')
    await inventoryPage.expectLoaded()

})

test('Invalid login page', async ({ page }) => {
    const loginPage = new LoginPage(page)


    await loginPage.goto()
    await loginPage.login('standard', 'secret')

  expect(loginPage.errorMessage).toBeVisible()

})

test('Empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.loginButton.click()

    expect(loginPage.errorMessage).toBeVisible()
} )
import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { CheckoutStep1Page } from '../../pages/CheckoutStep1Page'

async function goToCheckoutStep1(page: any) {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
}

test('checkout step 1 page renders correctly', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.expectLoaded()
    await expect(step1.firstNameInput).toBeVisible()
    await expect(step1.lastNameInput).toBeVisible()
    await expect(step1.postalCodeInput).toBeVisible()
    await expect(step1.continueButton).toBeVisible()
})

test('submitting empty form shows error', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.continueButton.click()
    await expect(step1.errorMessage).toBeVisible()
    await expect(step1.errorMessage).toContainText('First Name is required')
})

test('missing last name shows error', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.firstNameInput.fill('John')
    await step1.continueButton.click()
    await expect(step1.errorMessage).toContainText('Last Name is required')
})

test('missing postal code shows error', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.firstNameInput.fill('John')
    await step1.lastNameInput.fill('Doe')
    await step1.continueButton.click()
    await expect(step1.errorMessage).toContainText('Postal Code is required')
})

test('valid info proceeds to step 2', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.fillInfo('John', 'Doe', '12345')
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html')
})

test('cancel returns to cart', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.cancelButton.click()
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html')
})

test('error message can be dismissed', async ({ page }) => {
    await goToCheckoutStep1(page)
    const step1 = new CheckoutStep1Page(page)
    await step1.continueButton.click()
    await expect(step1.errorMessage).toBeVisible()
    await step1.errorButton.click()
    await expect(step1.errorMessage).not.toBeVisible()
})

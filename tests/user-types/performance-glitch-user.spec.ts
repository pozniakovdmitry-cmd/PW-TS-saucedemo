import { test, expect } from '@playwright/test'

test('performance_glitch_user login succeeds after delay', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.locator('[data-test="username"]').fill('performance_glitch_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
    await page.locator('[data-test="login-button"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html', { timeout: 10000 })
    await expect(page.locator('[data-test="title"]')).toHaveText('Products')
    await expect(page.locator('.inventory_list')).toBeVisible()
})

test('performance_glitch_user can complete full checkout', async ({ page }) => {
    test.setTimeout(60000)

    await page.goto('https://www.saucedemo.com/')
    await page.locator('[data-test="username"]').fill('performance_glitch_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
    await page.locator('[data-test="login-button"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html', { timeout: 15000 })

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
    await page.locator('[data-test="firstName"]').fill('Jane')
    await page.locator('[data-test="lastName"]').fill('Doe')
    await page.locator('[data-test="postalCode"]').fill('10001')
    await page.locator('[data-test="continue"]').click()
    await page.locator('[data-test="finish"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html', { timeout: 15000 })
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!')
})

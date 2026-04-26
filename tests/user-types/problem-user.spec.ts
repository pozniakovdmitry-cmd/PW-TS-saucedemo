import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.locator('[data-test="username"]').fill('problem_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
    await page.locator('[data-test="login-button"]').click()
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('problem_user can log in and reaches inventory page', async ({ page }) => {
    await expect(page.locator('[data-test="title"]')).toHaveText('Products')
})

test('problem_user sees wrong product images (all same src)', async ({ page }) => {
    const images = page.locator('.inventory_item_img img')
    const srcs = await images.evaluateAll(els => els.map((el: HTMLImageElement) => el.src))
    const uniqueSrcs = new Set(srcs)
    // problem_user shows the same wrong image for all products
    expect(uniqueSrcs.size).toBeLessThan(srcs.length)
})

test('problem_user cannot complete checkout due to last name bug', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    await page.locator('[data-test="shopping-cart-link"]').click()
    await page.locator('[data-test="checkout"]').click()
    await page.locator('[data-test="firstName"]').fill('John')
    await page.locator('[data-test="lastName"]').fill('Doe')
    await page.locator('[data-test="postalCode"]').fill('12345')
    await page.locator('[data-test="continue"]').click()
    await expect(page.locator('[data-test="error"]')).toBeVisible()
})

test('problem_user sort does not work correctly', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za')
    const names = await page.locator('.inventory_item_name').allTextContents()
    const correctlySorted = [...names].sort().reverse()
    expect(names).not.toEqual(correctlySorted)
})

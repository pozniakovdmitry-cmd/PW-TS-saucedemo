import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('sort dropdown shows all four options', async ({ page }) => {
    const options = page.locator('[data-test="product-sort-container"] option')
    await expect(options).toHaveCount(4)
    await expect(options.nth(0)).toHaveText('Name (A to Z)')
    await expect(options.nth(1)).toHaveText('Name (Z to A)')
    await expect(options.nth(2)).toHaveText('Price (low to high)')
    await expect(options.nth(3)).toHaveText('Price (high to low)')
})

test('sort by Name (Z to A)', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za')

    const names = await page.locator('.inventory_item_name').allTextContents()
    const sorted = [...names].sort().reverse()
    expect(names).toEqual(sorted)
})

test('sort by Price (low to high)', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi')

    const priceTexts = await page.locator('.inventory_item_price').allTextContents()
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')))
    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1])
    }
})

test('sort by Price (high to low)', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo')

    const priceTexts = await page.locator('.inventory_item_price').allTextContents()
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')))
    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1])
    }
})

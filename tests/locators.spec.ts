import { test, expect } from '@playwright/test'

test('locators demo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')

    // 1. по атрибуту — самый надёжный когда есть
    await page.locator('[data-test="username"]').fill('standard_user')

    // 2. по роли — второй по надёжности, семантический
    await page.getByRole('button', { name: 'Login' }).click()

    // 3. по label — для форм
    await page.getByLabel('Password').fill('secret_sauce')

    // 4. по тексту — хрупкий, текст может поменяться
    await page.getByText('Swag Labs')

    // 5. CSS селектор — последний вариант
    await page.locator('.login-button')
})


 test('login with role and label locators', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.getByRole('textbox', {name: 'Username'}).fill('standard_user')
     await page.getByRole('textbox', {name: 'Password' }).fill('secret_sauce')
     await page.locator('[data-test="login-button"]').click()
     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
})

test('assertions demo',
    async ({page}) => {
        await page.goto('https://www.saucedemo.com/')
        await page.locator('[data-test="username"]').fill('standard_user')
        await page.locator('[data-test="password"]').fill('secret_sauce')
        await page.locator('[data-test="login-button"]').click()

        // страница загрузилась правильно
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')

        // элемент виден на странице
        await expect(page.locator('.inventory_list')).toBeVisible()

        // текст на странице
        await expect(page.locator('[data-test="title"]')).toHaveText('Products')
    })

test('Invalid login shows error message', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await page.locator('[data-test="username"]').fill('error')
    await page.locator('[data-test="password"]').fill('secret')
    await page.locator('[data-test="login-button"]').click()

    await expect(page).toHaveURL('https://www.saucedemo.com')
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible()
})
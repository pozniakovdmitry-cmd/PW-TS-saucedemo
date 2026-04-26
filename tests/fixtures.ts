import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'

type MyFixtures = {
  loginPage: LoginPage
  inventoryPage: InventoryPage
  cartPage: CartPage
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await use(loginPage)  // тест получает loginPage здесь
  },

  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    const inventoryPage = new InventoryPage(page)
    await use(inventoryPage)  // тест получает уже залогиненную страницу
  },

  cartPage: async ({page},use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('standard_user', 'secret_sauce')
    const inventoryPage = new InventoryPage(page)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator ('[data-test="shopping-cart-badge"]').click();
    const cartPage = new CartPage(page)
    await use( cartPage )
  }
})

export { expect } from '@playwright/test'
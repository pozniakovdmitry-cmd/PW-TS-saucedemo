import { CartPage } from '../pages/CartPage'
import { test, expect } from './fixtures'

test('inventory page loads after login', async ({ inventoryPage }) => {
  await inventoryPage.expectLoaded()
})

test('cartest001', async ({cartPage}) => {
    await cartPage.expectLoaded()
    await expect(cartPage.cartBadge ).toHaveText('1')
    await expect(cartPage.cartItems).toHaveCount(1)

})





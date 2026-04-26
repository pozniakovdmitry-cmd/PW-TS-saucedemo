import { test, expect } from '@playwright/test'

test('GET users returns 200', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users')
  expect(response.status()).toBe(200)
})

test('GET single user returns correct id', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1')
  const body = await response.json()
  expect(body.id).toBe(1)
  expect(body.name).toBeTruthy()
})

test('POST create user returns 201', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/users', {
    data: {
      name: 'Dmitry',
      email: 'dmitry@test.com'
    }
  })
  expect(response.status()).toBe(201)
  const body = await response.json()
  expect(body.name).toBe('Dmitry')
})

//CI comment to check
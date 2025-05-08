import { expect, test } from '@playwright/test'
import { loginAs } from './common.js'

test('should be able to log in', async ({ page }) => {
  const token = await loginAs(page, 'admin')
  expect(token.length).toBeGreaterThan(0)
})

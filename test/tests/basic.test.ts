import { expect, test } from '@playwright/test'
import { loginAs } from './common.js'

test('should be able to log in', async ({ page }) => {
  const token = await loginAs(page, 'su01')
  expect(token.length).toBeGreaterThan(0)
})

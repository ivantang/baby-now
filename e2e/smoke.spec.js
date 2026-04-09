import { test, expect } from '@playwright/test'

test.describe('App smoke tests', () => {
  test('loads without JavaScript errors', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors, `Console errors: ${errors.join(', ')}`).toHaveLength(0)
  })

  test('loads without unhandled promise rejections', async ({ page }) => {
    const rejections = []
    page.on('pageerror', err => rejections.push(err.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(rejections, `Page errors: ${rejections.join(', ')}`).toHaveLength(0)
  })

  test('page responds within 5 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.waitForSelector('h1')
    expect(Date.now() - start).toBeLessThan(5000)
  })
})

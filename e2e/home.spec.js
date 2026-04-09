import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Baby Week by Week')
  })

  test('shows main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Baby Week by Week' })).toBeVisible()
  })

  test('shows all 52 weeks loaded', async ({ page }) => {
    await expect(page.getByText(/52/)).toBeVisible()
  })

  test('shows 13 weeks with full content', async ({ page }) => {
    await expect(page.getByText(/13/)).toBeVisible()
  })

  test('shows Week 8 card with correct title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Week 8 — 2 months old' })).toBeVisible()
  })

  test('Week 8 highlight mentions social smiles', async ({ page }) => {
    await expect(page.getByText(/social smiles/i)).toBeVisible()
  })
})

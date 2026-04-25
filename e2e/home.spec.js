import { test, expect } from '@playwright/test'

test.describe('Birthday setup screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows setup screen when no profile exists', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Baby Week by Week' })).toBeVisible()
    await expect(page.getByLabel(/when was your baby born/i)).toBeVisible()
  })

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Baby Week by Week')
  })

  test('shows error when submitted without a date', async ({ page }) => {
    await page.getByRole('button', { name: /get started/i }).click()
    await expect(page.getByText(/valid birthday/i)).toBeVisible()
  })

  test('navigates to hero card after entering a birthday', async ({ page }) => {
    const eightWeeksAgo = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000)
    const dateStr = eightWeeksAgo.toISOString().split('T')[0]

    await page.getByLabel(/baby's name/i).fill('Lily')
    await page.getByLabel(/when was your baby born/i).fill(dateStr)
    await page.getByRole('button', { name: /get started/i }).click()

    await expect(page.getByText(/Lily is/i)).toBeVisible()
    await expect(page.getByText(/^Week \d+$/)).toBeVisible()
  })
})

test.describe('Week hero card', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-seed localStorage with a profile (week 8 — full content)
    const birthday = new Date(Date.now() - 7 * 7 * 24 * 60 * 60 * 1000)
    await page.addInitScript((birthdayISO) => {
      localStorage.setItem(
        'baby_profile',
        JSON.stringify({ babyName: 'Lily', birthdayISO })
      )
    }, birthday.toISOString())
    await page.goto('/')
  })

  test('shows baby name and week', async ({ page }) => {
    await expect(page.getByText(/Lily is/i)).toBeVisible()
    await expect(page.getByText('Week 8')).toBeVisible()
  })

  test('shows developmental highlight for a full-content week', async ({ page }) => {
    await expect(page.locator('.week-card-highlight')).toContainText(/social smiles/i)
  })

  test('shows sleep and feeding stats', async ({ page }) => {
    await expect(page.getByText('Sleep', { exact: true })).toBeVisible()
    await expect(page.getByText('Feeding', { exact: true })).toBeVisible()
  })

  test('change birthday returns to setup screen', async ({ page }) => {
    await page.getByRole('button', { name: /change birthday/i }).click()
    await expect(page.getByRole('heading', { name: 'Baby Week by Week' })).toBeVisible()
  })
})

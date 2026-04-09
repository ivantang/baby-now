import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.jsx'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('App — no profile set', () => {
  it('shows the setup screen when no birthday is stored', () => {
    render(<App />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByLabelText(/birthday/i)).toBeInTheDocument()
  })

  it('shows a submit button on the setup screen', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /see this week/i })).toBeInTheDocument()
  })

  it('shows an error if submitted without a date', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /see this week/i }))
    expect(screen.getByText(/valid birthday/i)).toBeInTheDocument()
  })
})

describe('App — profile saved', () => {
  function saveProfile(weeksAgo = 8, name = 'Lily') {
    const birthday = new Date(Date.now() - weeksAgo * 7 * 24 * 60 * 60 * 1000)
    localStorage.setItem(
      'baby_profile',
      JSON.stringify({ babyName: name, birthdayISO: birthday.toISOString() })
    )
  }

  it('shows the hero card when a profile exists', () => {
    saveProfile(8, 'Lily')
    render(<App />)
    expect(screen.getByText(/Week/)).toBeInTheDocument()
    expect(screen.getByText(/Lily is/i)).toBeInTheDocument()
  })

  it('displays the correct week number', () => {
    saveProfile(8) // 8 weeks ago → week 9
    render(<App />)
    expect(screen.getByText('Week 9')).toBeInTheDocument()
  })

  it('shows week content for a full-content week', () => {
    saveProfile(7) // 7 weeks ago → week 8 (full content)
    render(<App />)
    expect(screen.getByText(/social smiles/i)).toBeInTheDocument()
  })

  it('shows stub message for a stub week', () => {
    saveProfile(1) // 1 week ago → week 2 (stub)
    render(<App />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('clears profile when "Change birthday" is clicked', () => {
    saveProfile(8)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /change birthday/i }))
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })
})

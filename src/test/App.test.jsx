import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Baby Week by Week')).toBeInTheDocument()
  })

  it('shows the correct total week count', () => {
    render(<App />)
    expect(screen.getByText(/52/)).toBeInTheDocument()
  })

  it('shows the correct full content week count', () => {
    render(<App />)
    expect(screen.getByText(/13/)).toBeInTheDocument()
  })

  it('renders the week 8 highlight text', () => {
    render(<App />)
    expect(screen.getByText(/social smiles/i)).toBeInTheDocument()
  })
})

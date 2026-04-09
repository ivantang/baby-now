import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBabyProfile } from '../../hooks/useBabyProfile.js'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('useBabyProfile', () => {
  it('returns null currentWeek when no profile is stored', () => {
    const { result } = renderHook(() => useBabyProfile())
    expect(result.current.currentWeek).toBeNull()
    expect(result.current.birthday).toBeNull()
    expect(result.current.babyName).toBe('')
  })

  it('setProfile persists to localStorage and updates state', () => {
    const { result } = renderHook(() => useBabyProfile())
    const birthday = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000)

    act(() => result.current.setProfile('Lily', birthday))

    expect(result.current.babyName).toBe('Lily')
    expect(result.current.birthday).toEqual(birthday)
    expect(result.current.currentWeek).toBeGreaterThanOrEqual(1)
    expect(result.current.currentWeek).toBeLessThanOrEqual(52)
  })

  it('clearProfile removes data from localStorage and resets state', () => {
    const { result } = renderHook(() => useBabyProfile())
    const birthday = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000)

    act(() => result.current.setProfile('Lily', birthday))
    act(() => result.current.clearProfile())

    expect(result.current.currentWeek).toBeNull()
    expect(result.current.babyName).toBe('')
    expect(localStorage.getItem('baby_profile')).toBeNull()
  })

  it('reads an existing profile from localStorage on mount', () => {
    const birthday = new Date(Date.now() - 7 * 7 * 24 * 60 * 60 * 1000)
    localStorage.setItem(
      'baby_profile',
      JSON.stringify({ babyName: 'Sam', birthdayISO: birthday.toISOString() })
    )

    const { result } = renderHook(() => useBabyProfile())
    expect(result.current.babyName).toBe('Sam')
    expect(result.current.currentWeek).toBe(8)
  })

  it('returns null gracefully when localStorage contains invalid JSON', () => {
    localStorage.setItem('baby_profile', 'not-json')
    const { result } = renderHook(() => useBabyProfile())
    expect(result.current.currentWeek).toBeNull()
  })
})

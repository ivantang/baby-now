import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMilestones } from '../../hooks/useMilestones.js'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('useMilestones', () => {
  it('returns an empty list when nothing is stored', () => {
    const { result } = renderHook(() => useMilestones())
    expect(result.current.milestones).toEqual([])
  })

  it('addMilestone creates an entry with the correct fields', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First smile', '2025-03-15', 'Such a big grin!'))

    const { milestones } = result.current
    expect(milestones).toHaveLength(1)
    expect(milestones[0].name).toBe('First smile')
    expect(milestones[0].achievedAt).toBe('2025-03-15')
    expect(milestones[0].note).toBe('Such a big grin!')
    expect(milestones[0].id).toMatch(/^[0-9a-f-]{36}$/)
    expect(milestones[0].createdAt).toBeTruthy()
  })

  it('addMilestone stores null for empty note', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First laugh', '2025-04-01'))

    expect(result.current.milestones[0].note).toBeNull()
  })

  it('addMilestone stores null for whitespace-only note', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First laugh', '2025-04-01', '   '))

    expect(result.current.milestones[0].note).toBeNull()
  })

  it('addMilestone persists to localStorage', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First roll', '2025-05-10'))

    const stored = JSON.parse(localStorage.getItem('baby_milestones'))
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('First roll')
  })

  it('reads existing milestones from localStorage on mount', () => {
    const existing = [{
      id: 'abc-123',
      name: 'First steps',
      achievedAt: '2025-09-01',
      note: null,
      createdAt: new Date().toISOString(),
    }]
    localStorage.setItem('baby_milestones', JSON.stringify(existing))

    const { result } = renderHook(() => useMilestones())
    expect(result.current.milestones).toHaveLength(1)
    expect(result.current.milestones[0].name).toBe('First steps')
  })

  it('updateMilestone changes the correct fields', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First smile', '2025-03-15'))
    const id = result.current.milestones[0].id

    act(() => result.current.updateMilestone(id, { note: 'So sweet!' }))

    expect(result.current.milestones[0].note).toBe('So sweet!')
    expect(result.current.milestones[0].name).toBe('First smile')
  })

  it('updateMilestone persists the change to localStorage', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First smile', '2025-03-15'))
    const id = result.current.milestones[0].id

    act(() => result.current.updateMilestone(id, { achievedAt: '2025-03-20' }))

    const stored = JSON.parse(localStorage.getItem('baby_milestones'))
    expect(stored[0].achievedAt).toBe('2025-03-20')
  })

  it('deleteMilestone removes the entry', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First smile', '2025-03-15'))
    act(() => result.current.addMilestone('First laugh', '2025-04-01'))
    const id = result.current.milestones.find(m => m.name === 'First smile').id

    act(() => result.current.deleteMilestone(id))

    expect(result.current.milestones).toHaveLength(1)
    expect(result.current.milestones[0].name).toBe('First laugh')
  })

  it('deleteMilestone persists the removal to localStorage', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('First smile', '2025-03-15'))
    const id = result.current.milestones[0].id

    act(() => result.current.deleteMilestone(id))

    const stored = JSON.parse(localStorage.getItem('baby_milestones'))
    expect(stored).toHaveLength(0)
  })

  it('returns an empty list gracefully when localStorage contains invalid JSON', () => {
    localStorage.setItem('baby_milestones', 'not-json')
    const { result } = renderHook(() => useMilestones())
    expect(result.current.milestones).toEqual([])
  })

  it('addMilestone trims whitespace from name', () => {
    const { result } = renderHook(() => useMilestones())

    act(() => result.current.addMilestone('  First smile  ', '2025-03-15'))

    expect(result.current.milestones[0].name).toBe('First smile')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePhotoJournal } from '../../hooks/usePhotoJournal.js'

// ── Mock IndexedDB layer ──────────────────────────────────────
const mockStore = new Map()

vi.mock('../../lib/journalDb.js', () => ({
  getAllEntries: vi.fn(async () => [...mockStore.values()]),
  getEntry: vi.fn(async id => mockStore.get(id)),
  putEntry: vi.fn(async entry => { mockStore.set(entry.id, entry) }),
  deleteEntry: vi.fn(async id => { mockStore.delete(id) }),
}))

// ── Mock image compression (returns the input as-is) ─────────
vi.mock('../../lib/imageUtils.js', () => ({
  compressImage: vi.fn(async file => new Blob([file], { type: 'image/jpeg' })),
}))

// ── Mock URL.createObjectURL / revokeObjectURL ────────────────
let urlCounter = 0
global.URL.createObjectURL = vi.fn(() => `blob:mock-${++urlCounter}`)
global.URL.revokeObjectURL = vi.fn()

function makeFile(name = 'photo.jpg') {
  return new File(['pixel'], name, { type: 'image/jpeg' })
}

beforeEach(() => {
  mockStore.clear()
  vi.clearAllMocks()
  urlCounter = 0
})

describe('usePhotoJournal', () => {
  it('starts with empty entries when DB is empty', async () => {
    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.entries).toEqual([])
  })

  it('loads existing entries from DB on mount', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' })
    mockStore.set('entry-1', {
      id: 'entry-1',
      photoBlob: blob,
      weekNumber: 4,
      milestoneId: null,
      caption: 'Hello world',
      createdAt: new Date().toISOString(),
    })

    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].caption).toBe('Hello world')
    expect(result.current.entries[0].photoUrl).toMatch(/^blob:/)
    expect(result.current.entries[0].photoBlob).toBeUndefined()
  })

  it('addEntry compresses the file and stores the entry', async () => {
    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addEntry({
        file: makeFile(),
        weekNumber: 6,
        caption: 'First bath',
      })
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].weekNumber).toBe(6)
    expect(result.current.entries[0].caption).toBe('First bath')
    expect(result.current.entries[0].photoUrl).toMatch(/^blob:/)
  })

  it('addEntry trims whitespace and stores null for blank caption', async () => {
    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addEntry({ file: makeFile(), caption: '   ' })
    })

    expect(result.current.entries[0].caption).toBeNull()
  })

  it('addEntry prepends new entry to the list', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' })
    mockStore.set('old', {
      id: 'old',
      photoBlob: blob,
      weekNumber: null,
      milestoneId: null,
      caption: 'Old photo',
      createdAt: '2025-01-01T00:00:00.000Z',
    })

    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addEntry({ file: makeFile(), caption: 'New photo' })
    })

    expect(result.current.entries[0].caption).toBe('New photo')
    expect(result.current.entries[1].caption).toBe('Old photo')
  })

  it('updateCaption updates the caption in state and DB', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' })
    mockStore.set('entry-1', {
      id: 'entry-1',
      photoBlob: blob,
      weekNumber: null,
      milestoneId: null,
      caption: 'Original',
      createdAt: new Date().toISOString(),
    })

    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateCaption('entry-1', 'Updated caption')
    })

    expect(result.current.entries[0].caption).toBe('Updated caption')
    const stored = mockStore.get('entry-1')
    expect(stored.caption).toBe('Updated caption')
  })

  it('updateCaption stores null for blank caption', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' })
    mockStore.set('entry-1', {
      id: 'entry-1',
      photoBlob: blob,
      weekNumber: null,
      milestoneId: null,
      caption: 'Original',
      createdAt: new Date().toISOString(),
    })

    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateCaption('entry-1', '  ')
    })

    expect(result.current.entries[0].caption).toBeNull()
  })

  it('deleteEntry removes the entry from state and DB', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' })
    mockStore.set('entry-1', {
      id: 'entry-1',
      photoBlob: blob,
      weekNumber: null,
      milestoneId: null,
      caption: null,
      createdAt: new Date().toISOString(),
    })

    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.deleteEntry('entry-1')
    })

    expect(result.current.entries).toHaveLength(0)
    expect(mockStore.has('entry-1')).toBe(false)
  })

  it('entries are sorted newest first', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' })
    mockStore.set('older', {
      id: 'older', photoBlob: blob, weekNumber: null, milestoneId: null,
      caption: 'Older', createdAt: '2025-01-01T00:00:00.000Z',
    })
    mockStore.set('newer', {
      id: 'newer', photoBlob: blob, weekNumber: null, milestoneId: null,
      caption: 'Newer', createdAt: '2025-06-01T00:00:00.000Z',
    })

    const { result } = renderHook(() => usePhotoJournal())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.entries[0].caption).toBe('Newer')
    expect(result.current.entries[1].caption).toBe('Older')
  })
})

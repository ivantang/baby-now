import { useState, useEffect, useCallback, useRef } from 'react'
import * as db from '../lib/journalDb.js'
import { compressImage } from '../lib/imageUtils.js'

/**
 * Creates a temporary object URL for a blob and tracks it for cleanup.
 * @param {Blob} blob
 * @param {string[]} urlList  mutable array to push the URL into
 */
function makeBlobUrl(blob, urlList) {
  const url = URL.createObjectURL(blob)
  urlList.push(url)
  return url
}

/**
 * Converts a raw DB entry (with photoBlob) to a display entry (with photoUrl).
 * @param {Object} raw
 * @param {string[]} urlList
 */
function toDisplay(raw, urlList) {
  const { photoBlob, ...rest } = raw
  return { ...rest, photoUrl: makeBlobUrl(photoBlob, urlList) }
}

/**
 * CRUD hook for the photo journal, backed by IndexedDB.
 *
 * @returns {{
 *   entries: import('../data/schema.js').JournalEntry[],
 *   loading: boolean,
 *   addEntry: (opts: { file: File, weekNumber?: number|null, milestoneId?: string|null, caption?: string }) => Promise<void>,
 *   updateCaption: (id: string, caption: string) => Promise<void>,
 *   deleteEntry: (id: string) => Promise<void>,
 * }}
 */
export function usePhotoJournal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const urlsRef = useRef([])

  useEffect(() => {
    db.getAllEntries()
      .then(raws => {
        const sorted = [...raws].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        setEntries(sorted.map(r => toDisplay(r, urlsRef.current)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => {
      urlsRef.current.forEach(url => URL.revokeObjectURL(url))
      urlsRef.current = []
    }
  }, [])

  const addEntry = useCallback(async ({ file, weekNumber = null, milestoneId = null, caption = '' }) => {
    const photoBlob = await compressImage(file)
    const raw = {
      id: crypto.randomUUID(),
      photoBlob,
      weekNumber: weekNumber ?? null,
      milestoneId: milestoneId ?? null,
      caption: caption.trim() || null,
      createdAt: new Date().toISOString(),
    }
    await db.putEntry(raw)
    setEntries(prev => [toDisplay(raw, urlsRef.current), ...prev])
  }, [])

  const updateCaption = useCallback(async (id, caption) => {
    const raw = await db.getEntry(id)
    if (!raw) return
    const updated = { ...raw, caption: caption.trim() || null }
    await db.putEntry(updated)
    setEntries(prev => prev.map(e => e.id === id ? { ...e, caption: updated.caption } : e))
  }, [])

  const deleteEntry = useCallback(async (id) => {
    await db.deleteEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return { entries, loading, addEntry, updateCaption, deleteEntry }
}

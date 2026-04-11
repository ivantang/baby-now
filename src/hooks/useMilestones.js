import { useState, useCallback } from 'react'

const STORAGE_KEY = 'baby_milestones'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(milestones) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones))
}

/**
 * CRUD hook for baby milestones, persisted to localStorage.
 *
 * @returns {{
 *   milestones: import('../data/schema.js').Milestone[],
 *   addMilestone: (name: string, achievedAt: string, note?: string) => void,
 *   updateMilestone: (id: string, updates: Partial<import('../data/schema.js').Milestone>) => void,
 *   deleteMilestone: (id: string) => void,
 * }}
 */
export function useMilestones() {
  const [milestones, setMilestones] = useState(load)

  const addMilestone = useCallback((name, achievedAt, note = null) => {
    const entry = {
      id: crypto.randomUUID(),
      name: name.trim(),
      achievedAt,
      note: note?.trim() || null,
      createdAt: new Date().toISOString(),
    }
    setMilestones(prev => {
      const next = [entry, ...prev]
      save(next)
      return next
    })
  }, [])

  const updateMilestone = useCallback((id, updates) => {
    setMilestones(prev => {
      const next = prev.map(m =>
        m.id === id
          ? {
              ...m,
              ...updates,
              name: updates.name !== undefined ? updates.name.trim() : m.name,
              note: updates.note !== undefined ? (updates.note?.trim() || null) : m.note,
            }
          : m
      )
      save(next)
      return next
    })
  }, [])

  const deleteMilestone = useCallback((id) => {
    setMilestones(prev => {
      const next = prev.filter(m => m.id !== id)
      save(next)
      return next
    })
  }, [])

  return { milestones, addMilestone, updateMilestone, deleteMilestone }
}

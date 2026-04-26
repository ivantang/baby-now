import { useState, useCallback, useEffect, useMemo } from 'react'
import { WEEK_BADGES } from '../data/badges.js'

const STORAGE_KEY = 'baby_badges'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(badges) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(badges))
}

/**
 * Hook for managing baby achievement badges, persisted to localStorage.
 *
 * Week badges auto-unlock silently when the baby reaches the trigger week.
 * Developmental badges are earned by calling earnBadge(id) from outside.
 *
 * @param {number} currentWeek - Baby's current age in weeks (for auto-unlocking week badges)
 * @returns {{
 *   earnedBadges: Array<{ id: string, earnedAt: string }>,
 *   earnedIds: Set<string>,
 *   earnBadge: (id: string) => boolean,
 *   justEarnedId: string | null,
 *   clearJustEarned: () => void,
 * }}
 */
export function useBadges(currentWeek = 0) {
  const [earnedBadges, setEarnedBadges] = useState(load)
  const [justEarnedId, setJustEarnedId] = useState(null)

  const earnedIds = useMemo(
    () => new Set(earnedBadges.map(b => b.id)),
    [earnedBadges]
  )

  // Earn a badge by id. Returns true if it was newly earned.
  const earnBadge = useCallback((id) => {
    let wasNew = false
    setEarnedBadges(prev => {
      if (prev.some(b => b.id === id)) return prev
      wasNew = true
      const entry = { id, earnedAt: new Date().toISOString() }
      const next = [...prev, entry]
      save(next)
      return next
    })
    if (wasNew) setJustEarnedId(id)
    return wasNew
  }, [])

  const clearJustEarned = useCallback(() => setJustEarnedId(null), [])

  // Auto-earn week badges silently (no unlock toast) when the week changes.
  useEffect(() => {
    if (!currentWeek) return
    setEarnedBadges(prev => {
      const earned = new Set(prev.map(b => b.id))
      const toAdd = WEEK_BADGES.filter(
        b => currentWeek >= b.weekTrigger && !earned.has(b.id)
      )
      if (toAdd.length === 0) return prev
      const now = new Date().toISOString()
      const next = [...prev, ...toAdd.map(b => ({ id: b.id, earnedAt: now }))]
      save(next)
      return next
    })
  }, [currentWeek])

  return { earnedBadges, earnedIds, earnBadge, justEarnedId, clearJustEarned }
}

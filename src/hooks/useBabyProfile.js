import { useState, useCallback } from 'react'
import { getCurrentWeek } from '../data/index.js'

const STORAGE_KEY = 'baby_profile'

/**
 * Reads and writes the baby profile to localStorage.
 *
 * @returns {{
 *   babyName: string,
 *   birthday: Date | null,
 *   currentWeek: number | null,
 *   setProfile: (name: string, birthday: Date) => void,
 *   clearProfile: () => void,
 * }}
 */
export function useBabyProfile() {
  const [profile, setProfileState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const { babyName, birthdayISO } = JSON.parse(raw)
      return { babyName, birthday: new Date(birthdayISO) }
    } catch {
      return null
    }
  })

  const setProfile = useCallback((babyName, birthday) => {
    const data = { babyName, birthdayISO: birthday.toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setProfileState({ babyName, birthday })
  }, [])

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfileState(null)
  }, [])

  const currentWeek = profile?.birthday ? getCurrentWeek(profile.birthday) : null

  return {
    babyName: profile?.babyName ?? '',
    birthday: profile?.birthday ?? null,
    currentWeek,
    setProfile,
    clearProfile,
  }
}

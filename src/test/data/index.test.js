import { describe, it, expect } from 'vitest'
import {
  weekMap,
  getWeek,
  getAllWeeks,
  getFullWeeks,
  getCurrentWeek,
} from '../../data/index.js'

describe('weekMap', () => {
  it('contains exactly 52 entries', () => {
    expect(weekMap.size).toBe(52)
  })

  it('has entries for every week 1–52', () => {
    for (let w = 1; w <= 52; w++) {
      expect(weekMap.has(w), `missing week ${w}`).toBe(true)
    }
  })
})

describe('getWeek()', () => {
  it('returns the correct entry for a known week', () => {
    const week8 = getWeek(8)
    expect(week8).toBeDefined()
    expect(week8.week).toBe(8)
  })

  it('returns undefined for week 0', () => {
    expect(getWeek(0)).toBeUndefined()
  })

  it('returns undefined for week 53', () => {
    expect(getWeek(53)).toBeUndefined()
  })
})

describe('getAllWeeks()', () => {
  it('returns exactly 52 entries', () => {
    expect(getAllWeeks()).toHaveLength(52)
  })

  it('is sorted by week number ascending', () => {
    const weeks = getAllWeeks()
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i].week).toBeGreaterThan(weeks[i - 1].week)
    }
  })

  it('starts at week 1 and ends at week 52', () => {
    const weeks = getAllWeeks()
    expect(weeks[0].week).toBe(1)
    expect(weeks[51].week).toBe(52)
  })
})

describe('getFullWeeks()', () => {
  it('returns exactly 13 full weeks (4–16)', () => {
    expect(getFullWeeks()).toHaveLength(13)
  })

  it('only contains weeks with isStub: false', () => {
    getFullWeeks().forEach(w => {
      expect(w.isStub).toBe(false)
    })
  })

  it('contains exactly weeks 4 through 16', () => {
    const weekNumbers = getFullWeeks().map(w => w.week)
    for (let w = 4; w <= 16; w++) {
      expect(weekNumbers).toContain(w)
    }
    expect(weekNumbers).not.toContain(3)
    expect(weekNumbers).not.toContain(17)
  })

  it('is sorted by week number ascending', () => {
    const weeks = getFullWeeks()
    for (let i = 1; i < weeks.length; i++) {
      expect(weeks[i].week).toBeGreaterThan(weeks[i - 1].week)
    }
  })
})

describe('WeekEntry schema conformance', () => {
  it('every entry has all required top-level fields', () => {
    getAllWeeks().forEach(w => {
      expect(w, `week ${w.week}`).toMatchObject({
        week: expect.any(Number),
        ageRange: expect.any(String),
        title: expect.any(String),
        highlight: expect.any(String),
        physical: expect.any(Object),
        cognitive: expect.any(Object),
        sleep: expect.any(Object),
        feeding: expect.any(Object),
        play: expect.any(Object),
        parentTips: expect.any(Object),
        isStub: expect.any(Boolean),
      })
    })
  })

  it('every entry has all required physical sub-fields', () => {
    getAllWeeks().forEach(w => {
      expect(w.physical, `week ${w.week} physical`).toHaveProperty('size')
      expect(w.physical).toHaveProperty('motorSkills')
      expect(w.physical).toHaveProperty('reflexes')
    })
  })

  it('every entry has all required cognitive sub-fields', () => {
    getAllWeeks().forEach(w => {
      expect(w.cognitive, `week ${w.week} cognitive`).toHaveProperty('vision')
      expect(w.cognitive).toHaveProperty('hearing')
      expect(w.cognitive).toHaveProperty('awareness')
    })
  })

  it('every entry has all required sleep sub-fields', () => {
    getAllWeeks().forEach(w => {
      expect(w.sleep, `week ${w.week} sleep`).toHaveProperty('totalHours')
      expect(w.sleep).toHaveProperty('nightSleep')
      expect(w.sleep).toHaveProperty('naps')
      expect(w.sleep).toHaveProperty('notes')
    })
  })

  it('every entry has all required feeding sub-fields', () => {
    getAllWeeks().forEach(w => {
      expect(w.feeding, `week ${w.week} feeding`).toHaveProperty('amount')
      expect(w.feeding).toHaveProperty('frequency')
      expect(w.feeding).toHaveProperty('hungerCues')
      expect(w.feeding).toHaveProperty('notes')
    })
  })

  it('every entry has play.activities as an array', () => {
    getAllWeeks().forEach(w => {
      expect(Array.isArray(w.play.activities), `week ${w.week} play.activities`).toBe(true)
    })
  })

  it('every entry has parentTips arrays', () => {
    getAllWeeks().forEach(w => {
      expect(Array.isArray(w.parentTips.selfCare), `week ${w.week} selfCare`).toBe(true)
      expect(Array.isArray(w.parentTips.watchFor), `week ${w.week} watchFor`).toBe(true)
      expect(Array.isArray(w.parentTips.callDoctor), `week ${w.week} callDoctor`).toBe(true)
    })
  })

  it('full weeks (4–16) have non-empty content in all sections', () => {
    getFullWeeks().forEach(w => {
      expect(w.highlight, `week ${w.week} highlight`).not.toBe('')
      expect(w.physical.motorSkills, `week ${w.week} motorSkills`).not.toBe('')
      expect(w.sleep.totalHours, `week ${w.week} totalHours`).not.toBe('')
      expect(w.feeding.amount, `week ${w.week} feeding amount`).not.toBe('')
      expect(w.play.activities.length, `week ${w.week} activities`).toBeGreaterThan(0)
      expect(w.parentTips.callDoctor.length, `week ${w.week} callDoctor`).toBeGreaterThan(0)
    })
  })

  it('stub weeks have isStub: true', () => {
    const stubs = getAllWeeks().filter(w => w.isStub)
    // weeks 1–3 and 17–52 = 3 + 36 = 39 stubs
    expect(stubs).toHaveLength(39)
  })
})

describe('getCurrentWeek()', () => {
  it('returns 1 for a baby born today', () => {
    expect(getCurrentWeek(new Date())).toBe(1)
  })

  it('returns 8 for a baby born 7 weeks ago', () => {
    const birthday = new Date(Date.now() - 7 * 7 * 24 * 60 * 60 * 1000)
    expect(getCurrentWeek(birthday)).toBe(8)
  })

  it('clamps to 1 for a future birthday', () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    expect(getCurrentWeek(future)).toBe(1)
  })

  it('clamps to 52 for a baby older than 52 weeks', () => {
    const longAgo = new Date(Date.now() - 100 * 7 * 24 * 60 * 60 * 1000)
    expect(getCurrentWeek(longAgo)).toBe(52)
  })

  it('returns a number between 1 and 52 for any date', () => {
    const result = getCurrentWeek(new Date('2024-01-01'))
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(52)
  })
})

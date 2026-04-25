/**
 * @fileoverview Single import surface for all week data.
 * All app code should import from here — never from individual week files directly.
 */

import { week01 } from './weeks/week-01.js'
import { week02 } from './weeks/week-02.js'
import { week03 } from './weeks/week-03.js'
import { week04 } from './weeks/week-04.js'
import { week05 } from './weeks/week-05.js'
import { week06 } from './weeks/week-06.js'
import { week07 } from './weeks/week-07.js'
import { week08 } from './weeks/week-08.js'
import { week09 } from './weeks/week-09.js'
import { week10 } from './weeks/week-10.js'
import { week11 } from './weeks/week-11.js'
import { week12 } from './weeks/week-12.js'
import { week13 } from './weeks/week-13.js'
import { week14 } from './weeks/week-14.js'
import { week15 } from './weeks/week-15.js'
import { week16 } from './weeks/week-16.js'
import { week17 } from './weeks/week-17.js'
import { week18 } from './weeks/week-18.js'
import { week19 } from './weeks/week-19.js'
import { week20 } from './weeks/week-20.js'
import { week21 } from './weeks/week-21.js'
import { week22 } from './weeks/week-22.js'
import { week23 } from './weeks/week-23.js'
import { week24 } from './weeks/week-24.js'
import { week25 } from './weeks/week-25.js'
import { week26 } from './weeks/week-26.js'
import { week27 } from './weeks/week-27.js'
import { week28 } from './weeks/week-28.js'
import { week29 } from './weeks/week-29.js'
import { week30 } from './weeks/week-30.js'
import { week31 } from './weeks/week-31.js'
import { week32 } from './weeks/week-32.js'
import { week33 } from './weeks/week-33.js'
import { week34 } from './weeks/week-34.js'
import { week35 } from './weeks/week-35.js'
import { week36 } from './weeks/week-36.js'
import { week37 } from './weeks/week-37.js'
import { week38 } from './weeks/week-38.js'
import { week39 } from './weeks/week-39.js'
import { week40 } from './weeks/week-40.js'
import { week41 } from './weeks/week-41.js'
import { week42 } from './weeks/week-42.js'
import { week43 } from './weeks/week-43.js'
import { week44 } from './weeks/week-44.js'
import { week45 } from './weeks/week-45.js'
import { week46 } from './weeks/week-46.js'
import { week47 } from './weeks/week-47.js'
import { week48 } from './weeks/week-48.js'
import { week49 } from './weeks/week-49.js'
import { week50 } from './weeks/week-50.js'
import { week51 } from './weeks/week-51.js'
import { week52 } from './weeks/week-52.js'

/**
 * Map of week number → WeekEntry. O(1) lookup by week number.
 * @type {Map<number, import('./schema.js').WeekEntry>}
 */
export const weekMap = new Map([
  [1,  week01],
  [2,  week02],
  [3,  week03],
  [4,  week04],
  [5,  week05],
  [6,  week06],
  [7,  week07],
  [8,  week08],
  [9,  week09],
  [10, week10],
  [11, week11],
  [12, week12],
  [13, week13],
  [14, week14],
  [15, week15],
  [16, week16],
  [17, week17],
  [18, week18],
  [19, week19],
  [20, week20],
  [21, week21],
  [22, week22],
  [23, week23],
  [24, week24],
  [25, week25],
  [26, week26],
  [27, week27],
  [28, week28],
  [29, week29],
  [30, week30],
  [31, week31],
  [32, week32],
  [33, week33],
  [34, week34],
  [35, week35],
  [36, week36],
  [37, week37],
  [38, week38],
  [39, week39],
  [40, week40],
  [41, week41],
  [42, week42],
  [43, week43],
  [44, week44],
  [45, week45],
  [46, week46],
  [47, week47],
  [48, week48],
  [49, week49],
  [50, week50],
  [51, week51],
  [52, week52],
])

/**
 * Returns the WeekEntry for a given week number (1–52), or undefined.
 * @param {number} weekNumber
 * @returns {import('./schema.js').WeekEntry | undefined}
 */
export function getWeek(weekNumber) {
  return weekMap.get(weekNumber)
}

/**
 * Returns all 52 week entries sorted by week number.
 * @returns {import('./schema.js').WeekEntry[]}
 */
export function getAllWeeks() {
  return [...weekMap.values()].sort((a, b) => a.week - b.week)
}

/**
 * Returns only weeks with fully written content (isStub: false), sorted by week number.
 * @returns {import('./schema.js').WeekEntry[]}
 */
export function getFullWeeks() {
  return [...weekMap.values()]
    .filter(w => !w.isStub)
    .sort((a, b) => a.week - b.week)
}

/**
 * Calculates the baby's current week based on their birthday.
 * Returns a week number clamped between 1 and 52.
 * @param {Date} birthday
 * @returns {number}
 */
export function getCurrentWeek(birthday) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const ageInWeeks = Math.floor((Date.now() - birthday.getTime()) / msPerWeek) + 1
  return Math.max(1, Math.min(52, ageInWeeks))
}

/**
 * Returns the day index (0–6) within the current week based on birthday.
 * Day 0 = first day of the week, day 6 = seventh day.
 * @param {Date} birthday
 * @returns {number}
 */
export function getCurrentDayOfWeek(birthday) {
  const msPerDay = 24 * 60 * 60 * 1000
  const ageInDays = Math.floor((Date.now() - birthday.getTime()) / msPerDay)
  return ageInDays % 7
}

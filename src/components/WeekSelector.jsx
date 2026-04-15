import React from 'react'
import { motion } from 'motion/react'

/**
 * Browse-weeks screen — 6-column grid of week numbers 1–52.
 * Past weeks are white cards, current is gold, future is dimmed.
 *
 * @param {{
 *   currentWeek: number,
 *   onWeekSelect: (week: number) => void,
 * }} props
 */
export default function WeekSelector({ currentWeek, onWeekSelect }) {
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1)

  return (
    <div className="week-selector">
      <h2 className="screen-title">Browse Weeks</h2>

      <div className="week-selector-grid">
        {weeks.map(week => {
          const isActive = week === currentWeek
          const isPast = week < currentWeek

          return (
            <motion.button
              key={week}
              onClick={() => onWeekSelect(week)}
              whileTap={{ scale: 0.93 }}
              className={`week-selector-btn${isActive ? ' week-selector-btn--active' : isPast ? ' week-selector-btn--past' : ' week-selector-btn--future'}`}
            >
              {week}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

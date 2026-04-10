import React from 'react'
import { getWeek } from '../data/index.js'

/**
 * Hero card displayed on the home screen showing the baby's current week.
 *
 * @param {{
 *   babyName: string,
 *   currentWeek: number,
 *   onChangeBirthday: () => void
 * }} props
 */
export default function WeekHeroCard({ babyName, currentWeek, onChangeBirthday }) {
  const weekData = getWeek(currentWeek)

  const greeting = babyName && babyName !== 'Baby'
    ? `${babyName} is`
    : 'Your baby is'

  return (
    <div className="hero-card">
      <div className="hero-week-badge">Week {currentWeek}</div>

      <h1 className="hero-title">
        {greeting} <span className="hero-week-label">{weekData?.ageRange ?? `${currentWeek} weeks old`}</span>
      </h1>

      {weekData && !weekData.isStub ? (
        <>
          <p className="hero-highlight">{weekData.highlight}</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Sleep</span>
              <span className="hero-stat-value">{weekData.sleep.totalHours}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Feeding</span>
              <span className="hero-stat-value">{weekData.feeding.frequency}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="hero-highlight hero-stub">
          Full content for week {currentWeek} is coming soon.
        </p>
      )}

      <button
        className="btn-ghost hero-change"
        onClick={onChangeBirthday}
        aria-label="Change birthday"
      >
        Change birthday
      </button>
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'motion/react'
import BabyCharacter from './BabyCharacter.jsx'
import { getWeek, getCurrentDayOfWeek } from '../data/index.js'

/**
 * Home tab — shows the current week card, BabyCharacter, today's daily fact,
 * this week's watch-for milestones (checkable), and the AI upsell banner.
 *
 * @param {{
 *   babyName: string,
 *   birthday: Date,
 *   currentWeek: number,
 *   onChangeBirthday: () => void,
 *   onGoToChat: () => void,
 * }} props
 */
export default function HomeScreen({ babyName, birthday, currentWeek, onChangeBirthday, onGoToChat }) {
  const weekData = getWeek(currentWeek)
  const dayOfWeek = birthday ? getCurrentDayOfWeek(birthday) : 0
  const todaysFact = weekData?.dailyFacts?.[dayOfWeek] ?? null

  // Derive per-week milestone items from watchFor array
  const milestoneItems = weekData?.parentTips?.watchFor?.map((text, i) => ({
    id: String(i),
    title: text,
  })) ?? []

  const [checked, setChecked] = useState(new Set())

  function toggleMilestone(id) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        if (navigator.vibrate) navigator.vibrate(50)
      }
      return next
    })
  }

  const greeting = babyName && babyName !== 'Baby' ? `${babyName}` : 'Your baby'

  return (
    <div className="home-screen">
      <h1 className="home-heading">Baby Week by Week</h1>

      {/* Week card */}
      <div className="week-card">
        <div className="week-card-badge">Week {currentWeek}</div>

        <h2 className="week-card-title">
          {greeting} is {weekData?.ageRange ?? `${currentWeek} weeks old`}
        </h2>

        {weekData && !weekData.isStub && (
          <p className="week-card-highlight">{weekData.highlight}</p>
        )}

        <div className="week-card-character">
          <BabyCharacter week={currentWeek} className="home-baby-svg" />
        </div>

        {weekData && !weekData.isStub && (
          <div className="week-card-stats">
            <div className="week-stat">
              <span className="week-stat-label">Sleep</span>
              <span className="week-stat-value">{weekData.sleep.totalHours}</span>
            </div>
            <div className="week-stat">
              <span className="week-stat-label">Feeding</span>
              <span className="week-stat-value">{weekData.feeding.frequency}</span>
            </div>
          </div>
        )}

        <button className="btn-ghost home-change-btn" onClick={onChangeBirthday}>
          Change birthday
        </button>
      </div>

      {/* Today's daily fact */}
      {todaysFact && (
        <motion.div
          className="home-daily-fact"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="home-daily-fact-label">Today</span>
          <p className="home-daily-fact-text">{todaysFact}</p>
        </motion.div>
      )}

      {/* This week's milestones */}
      {milestoneItems.length > 0 && (
        <div className="home-milestones">
          <h3 className="home-section-title">Watch for this week</h3>
          <div className="home-milestone-list">
            {milestoneItems.map(item => {
              const done = checked.has(item.id)
              return (
                <motion.button
                  key={item.id}
                  onClick={() => toggleMilestone(item.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`home-milestone-item${done ? ' home-milestone-item--done' : ''}`}
                >
                  <div className={`home-milestone-check${done ? ' home-milestone-check--done' : ''}`}>
                    {done && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        width="14" height="14" viewBox="0 0 16 16" fill="none"
                      >
                        <path d="M2 8L6 12L14 4" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                  <span className={`home-milestone-text${done ? ' home-milestone-text--done' : ''}`}>
                    {item.title}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* AI Chat upsell */}
      <div className="home-ai-banner">
        <h3 className="home-ai-title">Try AI Chat Assistant</h3>
        <p className="home-ai-body">
          Get personalized advice on sleep, feeding, and development.
        </p>
        <button className="home-ai-btn" onClick={onGoToChat}>
          Start free trial
        </button>
      </div>
    </div>
  )
}

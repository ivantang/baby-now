import React, { useState } from 'react'
import { motion } from 'motion/react'
import { MILESTONE_CATEGORIES } from '../data/milestoneOptions.js'
import { useMilestones } from '../hooks/useMilestones.js'
import MilestoneForm from './MilestoneForm.jsx'

/**
 * Milestones tab — 2-column card grid showing all pre-defined milestones.
 * Cards with logged milestones appear as achieved (lavender + checkmark).
 * Tapping an unachieved milestone opens the log form.
 */
export default function MilestonesScreen() {
  const { milestones, addMilestone, deleteMilestone } = useMilestones()
  const [logging, setLogging] = useState(null) // milestone name being logged

  // Build a set of achieved milestone names for O(1) lookup
  const achievedNames = new Set(milestones.map(m => m.name))

  function handleSave(name, achievedAt, note) {
    addMilestone(name, achievedAt, note)
    setLogging(null)
  }

  function handleUncheck(name) {
    const m = milestones.find(x => x.name === name)
    if (m) deleteMilestone(m.id)
  }

  if (logging) {
    return (
      <div className="milestone-screen">
        <MilestoneForm
          initial={{ name: logging, achievedAt: new Date().toISOString().split('T')[0], note: '' }}
          onSave={handleSave}
          onCancel={() => setLogging(null)}
        />
      </div>
    )
  }

  return (
    <div className="milestones-screen">
      <h2 className="screen-title">Milestones</h2>

      {MILESTONE_CATEGORIES.map(cat => (
        <div key={cat.category} className="milestone-category">
          <h3 className="milestone-category-title">{cat.category}</h3>
          <div className="milestone-grid">
            {cat.milestones.map((name, i) => {
              const achieved = achievedNames.has(name)
              return (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => achieved ? handleUncheck(name) : setLogging(name)}
                  className={`milestone-card${achieved ? ' milestone-card--achieved' : ''}`}
                >
                  {achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="milestone-card-check"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8L6 12L14 4" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  )}
                  <span className="milestone-card-name">{name}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

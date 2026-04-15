import React from 'react'
import { motion } from 'motion/react'
import BabyCharacter from './BabyCharacter.jsx'
import { getWeek } from '../data/index.js'

/**
 * Full week detail view. Reads real content from the week data store.
 *
 * @param {{
 *   week: number,
 *   onBack: () => void,
 * }} props
 */
export default function WeekContent({ week, onBack }) {
  const data = getWeek(week)

  // Build content sections from real week data
  const sections = data && !data.isStub
    ? [
        { title: 'Physical Development', content: data.physical.motorSkills },
        { title: 'Cognitive & Sensory', content: data.cognitive.vision + ' ' + data.cognitive.awareness },
        { title: 'Sleep', content: data.sleep.notes },
        { title: 'Feeding', content: data.feeding.notes },
        { title: 'Play & Bonding', content: data.play.bonding },
        { title: 'Parent Tips', content: data.parentTips.selfCare.join(' ') },
      ]
    : [{ title: 'Coming soon', content: `Detailed content for week ${week} is being prepared.` }]

  return (
    <div className="week-content">
      {/* Header */}
      <div className="week-content-header">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="week-content-back"
          aria-label="Go back"
        >
          ←
        </motion.button>
        <h2 className="screen-title">Week {week}</h2>
      </div>

      {/* Hero card */}
      <div className="week-content-hero">
        <div className="week-card-badge">Week {week}</div>
        <h3 className="week-content-title">
          {data?.ageRange ?? `${week} weeks old`}
        </h3>

        {data && !data.isStub && (
          <p className="week-content-highlight">{data.highlight}</p>
        )}

        <div className="week-content-character">
          <BabyCharacter week={week} className="home-baby-svg" />
        </div>

        {/* Size stat */}
        {data && !data.isStub && (
          <div className="week-content-size">
            <span className="week-stat-label">Size</span>
            <span className="week-stat-value">{data.physical.size}</span>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="week-content-sections">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="week-section"
          >
            <h4 className="week-section-title">{section.title}</h4>
            <p className="week-section-body">{section.content}</p>
          </motion.div>
        ))}

        {/* Watch for */}
        {data && !data.isStub && data.parentTips.watchFor.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sections.length * 0.05 }}
            className="week-section"
          >
            <h4 className="week-section-title">Watch for</h4>
            <ul className="week-watch-list">
              {data.parentTips.watchFor.map(item => (
                <li key={item} className="week-watch-item">{item}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  )
}

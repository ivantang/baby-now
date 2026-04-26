import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MILESTONE_CATEGORIES } from '../data/milestoneOptions.js'
import { DEVELOPMENTAL_BADGES, WEEK_BADGES, ALL_BADGES, BADGE_MAP, MILESTONE_TO_BADGE } from '../data/badges.js'
import { useMilestones } from '../hooks/useMilestones.js'
import { useBadges } from '../hooks/useBadges.js'
import MilestoneForm from './MilestoneForm.jsx'

// ── Badge shelf ──────────────────────────────────────────────────────────────

function BadgeShelf({ earnedIds, earnedBadges, onBadgeTap }) {
  return (
    <div className="badge-shelf">
      <h3 className="badge-shelf-title">Badges</h3>
      <div className="badge-grid">
        {ALL_BADGES.map(badge => {
          const earned = earnedIds.has(badge.id)
          const entry = earnedBadges.find(b => b.id === badge.id)
          return (
            <motion.button
              key={badge.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onBadgeTap(badge.id)}
              className={`badge-tile${earned ? ' badge-tile--earned' : ' badge-tile--locked'}`}
              aria-label={earned ? `${badge.name} — earned` : `${badge.name} — locked`}
            >
              <span className="badge-tile-emoji" aria-hidden="true">
                {earned ? badge.emoji : '🔒'}
              </span>
              <span className="badge-tile-name">{badge.name}</span>
              {earned && (
                <motion.div
                  className="badge-tile-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── Badge detail modal ───────────────────────────────────────────────────────

function BadgeDetail({ badgeId, earnedBadges, onClose }) {
  const badge = BADGE_MAP[badgeId]
  const entry = earnedBadges.find(b => b.id === badgeId)
  const earned = !!entry

  const earnedDate = entry
    ? new Date(entry.earnedAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const isWeekBadge = WEEK_BADGES.some(b => b.id === badgeId)
  const devBadge = DEVELOPMENTAL_BADGES.find(b => b.id === badgeId)

  return (
    <motion.div
      className="badge-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="badge-detail-card"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div className={`badge-detail-emoji-wrap${earned ? ' badge-detail-emoji-wrap--earned' : ''}`}>
          <span className="badge-detail-emoji">{earned ? badge.emoji : '🔒'}</span>
        </div>

        <h3 className="badge-detail-name">{badge.name}</h3>

        {earned ? (
          <>
            <p className="badge-detail-tagline">{badge.tagline}</p>
            <p className="badge-detail-date">Earned {earnedDate} 🎉</p>
          </>
        ) : (
          <p className="badge-detail-locked-hint">
            {isWeekBadge
              ? `Unlocks at week ${badge.weekTrigger}`
              : `Log "${devBadge?.milestoneTrigger}" to unlock`}
          </p>
        )}

        <button className="badge-detail-close" onClick={onClose}>Done</button>
      </motion.div>
    </motion.div>
  )
}

// ── Unlock toast ─────────────────────────────────────────────────────────────

function UnlockToast({ badgeId, onDone }) {
  const badge = BADGE_MAP[badgeId]

  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="badge-unlock-toast"
      initial={{ opacity: 0, y: -32, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <motion.span
        className="badge-unlock-toast-emoji"
        initial={{ scale: 0.5 }}
        animate={{ scale: [0.5, 1.25, 1] }}
        transition={{ duration: 0.45, times: [0, 0.55, 1] }}
      >
        {badge.emoji}
      </motion.span>
      <div className="badge-unlock-toast-text">
        <span className="badge-unlock-toast-label">Badge unlocked!</span>
        <span className="badge-unlock-toast-name">{badge.name}</span>
      </div>
    </motion.div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────────

/**
 * Milestones tab — badge shelf at the top, then a 2-column card grid of all
 * pre-defined milestones. Logging a milestone auto-earns matching badges.
 *
 * @param {{ currentWeek: number }} props
 */
export default function MilestonesScreen({ currentWeek = 1 }) {
  const { milestones, addMilestone, deleteMilestone } = useMilestones()
  const { earnedBadges, earnedIds, earnBadge, justEarnedId, clearJustEarned } = useBadges(currentWeek)
  const [logging, setLogging] = useState(null)
  const [detailBadgeId, setDetailBadgeId] = useState(null)

  const achievedNames = new Set(milestones.map(m => m.name))

  function handleSave(name, achievedAt, note) {
    addMilestone(name, achievedAt, note)
    const badgeId = MILESTONE_TO_BADGE[name]
    if (badgeId) earnBadge(badgeId)
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
      {/* Unlock toast */}
      <AnimatePresence>
        {justEarnedId && (
          <UnlockToast key={justEarnedId} badgeId={justEarnedId} onDone={clearJustEarned} />
        )}
      </AnimatePresence>

      {/* Badge detail modal */}
      <AnimatePresence>
        {detailBadgeId && (
          <BadgeDetail
            key={detailBadgeId}
            badgeId={detailBadgeId}
            earnedBadges={earnedBadges}
            onClose={() => setDetailBadgeId(null)}
          />
        )}
      </AnimatePresence>

      <h2 className="screen-title">Milestones</h2>

      {/* Badge shelf */}
      <BadgeShelf
        earnedIds={earnedIds}
        earnedBadges={earnedBadges}
        onBadgeTap={setDetailBadgeId}
      />

      {/* Milestone categories */}
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

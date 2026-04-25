import React, { useState } from 'react'
import { motion } from 'motion/react'
import BabyCharacter from './BabyCharacter.jsx'

/**
 * Shown on first launch when no baby profile exists.
 * Collects baby name and birthday, then calls onSave.
 *
 * @param {{ onSave: (name: string, birthday: Date) => void }} props
 */
export default function BirthdaySetup({ onSave }) {
  const [name, setName] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const birthday = new Date(dateValue)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    if (!dateValue || isNaN(birthday.getTime())) {
      setError('Please enter a valid birthday.')
      return
    }
    if (birthday > today) {
      setError("Birthday can't be in the future.")
      return
    }

    onSave(name.trim() || 'Baby', birthday)
  }

  const today = new Date().toISOString().split('T')[0]
  const minDate = new Date(Date.now() - 52 * 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return (
    <div className="onboarding-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="onboarding-inner"
      >
        <div className="onboarding-character">
          <BabyCharacter week={1} className="onboarding-baby-svg" />
        </div>

        <div className="onboarding-text">
          <h1 className="onboarding-title">Baby Week by Week</h1>
          <p className="onboarding-subtitle">
            Track your baby's development, milestones, and precious moments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="onboarding-field">
            <label className="onboarding-label" htmlFor="baby-name">
              Baby's name <span className="optional">(optional)</span>
            </label>
            <input
              id="baby-name"
              className="onboarding-input"
              type="text"
              placeholder="e.g. Lily"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={40}
              autoComplete="off"
            />
          </div>

          <div className="onboarding-field">
            <label className="onboarding-label" htmlFor="birthday">
              When was your baby born?
            </label>
            <input
              id="birthday"
              className="onboarding-input"
              type="date"
              value={dateValue}
              onChange={e => setDateValue(e.target.value)}
              max={today}
              min={minDate}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="onboarding-btn"
          >
            Get started
          </motion.button>

          <p className="onboarding-disclaimer">
            All content is free forever. Only AI chat requires a subscription.
          </p>
        </form>
      </motion.div>
    </div>
  )
}

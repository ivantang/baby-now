import React, { useState } from 'react'

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

  // Max date = today, min date = 52 weeks ago
  const today = new Date().toISOString().split('T')[0]
  const minDate = new Date(Date.now() - 52 * 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h1 className="setup-title">Welcome</h1>
        <p className="setup-subtitle">
          Let's get started. When was your baby born?
        </p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-field">
            <label htmlFor="baby-name">Baby's name <span className="optional">(optional)</span></label>
            <input
              id="baby-name"
              type="text"
              placeholder="e.g. Lily"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={40}
              autoComplete="off"
            />
          </div>

          <div className="form-field">
            <label htmlFor="birthday">Birthday <span className="required">*</span></label>
            <input
              id="birthday"
              type="date"
              value={dateValue}
              onChange={e => setDateValue(e.target.value)}
              max={today}
              min={minDate}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary">
            See this week →
          </button>
        </form>
      </div>
    </div>
  )
}

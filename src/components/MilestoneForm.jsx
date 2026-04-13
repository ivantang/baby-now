import React, { useState } from 'react'
import { MILESTONE_CATEGORIES } from '../data/milestoneOptions.js'

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Form for adding or editing a milestone.
 *
 * @param {{
 *   initial?: import('../data/schema.js').Milestone | null,
 *   onSave: (name: string, achievedAt: string, note: string) => void,
 *   onCancel: () => void,
 * }} props
 */
export default function MilestoneForm({ initial = null, onSave, onCancel }) {
  const [mode, setMode] = useState(initial?.name ? 'custom' : 'preset')
  const [preset, setPreset] = useState('')
  const [customName, setCustomName] = useState(initial?.name ?? '')
  const [achievedAt, setAchievedAt] = useState(initial?.achievedAt ?? today())
  const [note, setNote] = useState(initial?.note ?? '')
  const [error, setError] = useState('')

  const maxDate = today()

  function handleSubmit(e) {
    e.preventDefault()
    const name = mode === 'preset' ? preset : customName.trim()
    if (!name) {
      setError(mode === 'preset' ? 'Please select a milestone.' : 'Please enter a milestone name.')
      return
    }
    if (!achievedAt) {
      setError('Please enter the date this milestone was achieved.')
      return
    }
    if (achievedAt > maxDate) {
      setError('Achievement date cannot be in the future.')
      return
    }
    onSave(name, achievedAt, note)
  }

  return (
    <form className="milestone-form" onSubmit={handleSubmit} noValidate>
      <h2 className="milestone-form-title">
        {initial ? 'Edit milestone' : 'Log a milestone'}
      </h2>

      {!initial && (
        <div className="milestone-form-tabs">
          <button
            type="button"
            className={`milestone-tab${mode === 'preset' ? ' milestone-tab--active' : ''}`}
            onClick={() => { setMode('preset'); setError('') }}
          >
            Choose one
          </button>
          <button
            type="button"
            className={`milestone-tab${mode === 'custom' ? ' milestone-tab--active' : ''}`}
            onClick={() => { setMode('custom'); setError('') }}
          >
            Write your own
          </button>
        </div>
      )}

      {mode === 'preset' && !initial && (
        <div className="form-field">
          <label htmlFor="milestone-preset">Milestone</label>
          <select
            id="milestone-preset"
            className="milestone-select"
            value={preset}
            onChange={e => { setPreset(e.target.value); setError('') }}
          >
            <option value="">— select —</option>
            {MILESTONE_CATEGORIES.map(cat => (
              <optgroup key={cat.category} label={cat.category}>
                {cat.milestones.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {mode === 'custom' && (
        <div className="form-field">
          <label htmlFor="milestone-name">Milestone name</label>
          <input
            id="milestone-name"
            type="text"
            maxLength={80}
            placeholder="e.g. First trip to the park"
            value={customName}
            onChange={e => { setCustomName(e.target.value); setError('') }}
          />
        </div>
      )}

      <div className="form-field">
        <label htmlFor="milestone-date">Date achieved</label>
        <input
          id="milestone-date"
          type="date"
          max={maxDate}
          value={achievedAt}
          onChange={e => { setAchievedAt(e.target.value); setError('') }}
        />
      </div>

      <div className="form-field">
        <label htmlFor="milestone-note">
          Note <span className="optional">(optional)</span>
        </label>
        <textarea
          id="milestone-note"
          className="milestone-textarea"
          rows={3}
          maxLength={300}
          placeholder="Any special details you want to remember…"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="milestone-form-actions">
        <button type="submit" className="btn-primary">
          {initial ? 'Save changes' : 'Log milestone'}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

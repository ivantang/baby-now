import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function SettingsScreen({ babyName, birthday, onUpdateProfile, onClearProfile, onBack }) {
  const { user, signOut } = useAuth()

  const [nameInput, setNameInput] = useState(babyName || '')
  const [dateValue, setDateValue] = useState(() => {
    if (!birthday) return ''
    const y = birthday.getFullYear()
    const m = String(birthday.getMonth() + 1).padStart(2, '0')
    const d = String(birthday.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  })
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const minDate = new Date(Date.now() - 52 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  function handleSave(e) {
    e.preventDefault()
    if (!dateValue) return
    const newBirthday = new Date(dateValue)
    onUpdateProfile(nameInput.trim() || 'Baby', newBirthday)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    try { await signOut() } catch {}
  }

  function handleDeleteAll() {
    onClearProfile()
    if (user) signOut().catch(() => {})
  }

  return (
    <motion.div
      className="settings-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22 }}
    >
      <div className="settings-header">
        <button className="settings-back-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2 className="settings-title">Settings</h2>
      </div>

      <div className="settings-body">
        {/* Baby profile */}
        <section className="settings-section">
          <h3 className="settings-section-label">Baby Profile</h3>
          <form onSubmit={handleSave} className="settings-form">
            <div className="onboarding-field">
              <label className="onboarding-label" htmlFor="settings-name">
                Baby's name <span className="optional">(optional)</span>
              </label>
              <input
                id="settings-name"
                className="onboarding-input"
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="e.g. Lily"
                maxLength={40}
                autoComplete="off"
              />
            </div>

            <div className="onboarding-field">
              <label className="onboarding-label" htmlFor="settings-birthday">
                Birthday
              </label>
              <input
                id="settings-birthday"
                className="onboarding-input"
                type="date"
                value={dateValue}
                onChange={e => setDateValue(e.target.value)}
                max={today}
                min={minDate}
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className={`settings-save-btn${saved ? ' settings-save-btn--saved' : ''}`}
              disabled={!dateValue}
            >
              {saved ? '✓ Saved' : 'Save changes'}
            </motion.button>
          </form>
        </section>

        {/* Account */}
        <section className="settings-section">
          <h3 className="settings-section-label">Account</h3>
          {user ? (
            <div className="settings-account-row">
              <span className="settings-account-email">{user.email}</span>
              <button className="settings-link-btn" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          ) : (
            <p className="settings-muted">Not signed in — your data is saved locally on this device.</p>
          )}
        </section>

        {/* Subscription */}
        <section className="settings-section">
          <h3 className="settings-section-label">Subscription</h3>
          <div className="settings-sub-badge">
            <span className="settings-sub-pill">Free Trial</span>
            <span className="settings-muted">AI Chat included during trial period</span>
          </div>
        </section>

        {/* App */}
        <section className="settings-section">
          <h3 className="settings-section-label">App</h3>
          <span className="settings-muted">Version 1.0.0</span>
        </section>

        {/* Danger zone */}
        <section className="settings-section settings-section--danger">
          <h3 className="settings-section-label settings-section-label--danger">Data</h3>
          {showDeleteConfirm ? (
            <div className="settings-delete-confirm">
              <p className="settings-delete-warning">
                This will permanently delete all milestones, photos, and your baby's profile.
                This cannot be undone.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="settings-delete-btn"
                onClick={handleDeleteAll}
              >
                Yes, delete everything
              </motion.button>
              <button
                className="settings-link-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="settings-link-btn settings-link-btn--danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete account and all data
            </button>
          )}
        </section>
      </div>
    </motion.div>
  )
}

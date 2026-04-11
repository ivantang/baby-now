import React, { useState, useRef } from 'react'

const MAX_CAPTION = 200

/**
 * Form for adding a new journal photo.
 *
 * @param {{
 *   currentWeek: number,
 *   onSave: (opts: { file: File, weekNumber: number|null, caption: string }) => Promise<void>,
 *   onCancel: () => void,
 * }} props
 */
export default function PhotoUploadForm({ currentWeek, onSave, onCancel }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [weekNumber, setWeekNumber] = useState(currentWeek)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  function handleFileChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setFile(f)
    setError('')
    const url = URL.createObjectURL(f)
    setPreview(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setError('Please choose a photo.')
      return
    }
    setSaving(true)
    try {
      await onSave({ file, weekNumber, caption })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit} noValidate>
      <h2 className="upload-form-title">Add a photo</h2>

      <div
        className={`upload-drop-zone${file ? ' upload-drop-zone--filled' : ''}`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Choose photo"
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="upload-preview" />
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon" aria-hidden="true">📷</span>
            <span className="upload-hint">Tap to choose a photo</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="upload-input-hidden"
          onChange={handleFileChange}
          aria-label="Photo file input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="journal-week">Week tag</label>
        <select
          id="journal-week"
          className="milestone-select"
          value={weekNumber ?? ''}
          onChange={e => setWeekNumber(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">No week tag</option>
          {Array.from({ length: 52 }, (_, i) => i + 1).map(w => (
            <option key={w} value={w}>Week {w}{w === currentWeek ? ' (this week)' : ''}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="journal-caption">
          Caption <span className="optional">(optional)</span>
        </label>
        <textarea
          id="journal-caption"
          className="milestone-textarea"
          rows={3}
          maxLength={MAX_CAPTION}
          placeholder="What's happening in this photo?"
          value={caption}
          onChange={e => setCaption(e.target.value)}
        />
        <span className="upload-char-count">{caption.length}/{MAX_CAPTION}</span>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="milestone-form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Add to journal'}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

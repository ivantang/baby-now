import React, { useState } from 'react'
import { usePhotoJournal } from '../hooks/usePhotoJournal.js'
import PhotoUploadForm from './PhotoUploadForm.jsx'

const FILTER_ALL = 'all'
const FILTER_WEEK = 'week'

/**
 * Main photo journal screen.
 *
 * @param {{ currentWeek: number }} props
 */
export default function PhotoJournal({ currentWeek }) {
  const { entries, loading, addEntry, updateCaption, deleteEntry } = usePhotoJournal()
  const [view, setView] = useState('grid') // 'grid' | 'upload' | 'detail'
  const [filter, setFilter] = useState(FILTER_ALL)
  const [selected, setSelected] = useState(null)
  const [editingCaption, setEditingCaption] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const visible = filter === FILTER_WEEK
    ? entries.filter(e => e.weekNumber === currentWeek)
    : entries

  async function handleSave(opts) {
    await addEntry({ ...opts, weekNumber: opts.weekNumber ?? null })
    setView('grid')
  }

  function openDetail(entry) {
    setSelected(entry)
    setEditingCaption(entry.caption ?? '')
    setEditingId(null)
    setView('detail')
  }

  async function handleCaptionSave() {
    await updateCaption(selected.id, editingCaption)
    setSelected(prev => ({ ...prev, caption: editingCaption.trim() || null }))
    setEditingId(null)
  }

  async function handleDeleteConfirm(id) {
    await deleteEntry(id)
    setConfirmDelete(null)
    if (selected?.id === id) setView('grid')
  }

  if (view === 'upload') {
    return (
      <div className="journal-screen">
        <PhotoUploadForm
          currentWeek={currentWeek}
          onSave={handleSave}
          onCancel={() => setView('grid')}
        />
      </div>
    )
  }

  if (view === 'detail' && selected) {
    return (
      <div className="journal-screen">
        <button className="journal-back btn-ghost" onClick={() => setView('grid')}>
          ← Back
        </button>
        <img src={selected.photoUrl} alt={selected.caption ?? 'Journal photo'} className="journal-detail-img" />

        <div className="journal-detail-meta">
          {selected.weekNumber && (
            <span className="journal-week-tag">Week {selected.weekNumber}</span>
          )}
          <p className="journal-detail-date">
            {new Date(selected.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {editingId === selected.id ? (
          <div className="journal-caption-edit">
            <textarea
              className="milestone-textarea"
              rows={3}
              maxLength={200}
              value={editingCaption}
              onChange={e => setEditingCaption(e.target.value)}
              autoFocus
            />
            <div className="milestone-actions" style={{ marginTop: '0.5rem' }}>
              <button className="btn-ghost milestone-action" onClick={handleCaptionSave}>Save</button>
              <button className="btn-ghost milestone-action" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="journal-caption-display">
            <p className="journal-caption-text">
              {selected.caption || <em className="journal-caption-empty">No caption</em>}
            </p>
            <button className="btn-ghost milestone-action" onClick={() => setEditingId(selected.id)}>
              Edit caption
            </button>
          </div>
        )}

        <button
          className="btn-ghost milestone-action--delete"
          style={{ marginTop: '1rem', display: 'block' }}
          onClick={() => setConfirmDelete(selected.id)}
        >
          Delete photo
        </button>

        {confirmDelete && (
          <div className="milestone-dialog-backdrop" onClick={() => setConfirmDelete(null)}>
            <div
              className="milestone-dialog"
              role="dialog"
              aria-modal="true"
              onClick={e => e.stopPropagation()}
            >
              <p className="milestone-dialog-text">Delete this photo?</p>
              <div className="milestone-dialog-actions">
                <button
                  className="btn-primary milestone-dialog-delete"
                  onClick={() => handleDeleteConfirm(confirmDelete)}
                >
                  Delete
                </button>
                <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="journal-screen">
      <div className="journal-header">
        <h1 className="milestone-heading">Journal</h1>
        <p className="milestone-subheading">Every moment, free forever.</p>
      </div>

      <div className="journal-filter-row">
        <button
          className={`journal-filter-btn${filter === FILTER_ALL ? ' journal-filter-btn--active' : ''}`}
          onClick={() => setFilter(FILTER_ALL)}
        >
          All photos
        </button>
        <button
          className={`journal-filter-btn${filter === FILTER_WEEK ? ' journal-filter-btn--active' : ''}`}
          onClick={() => setFilter(FILTER_WEEK)}
        >
          Week {currentWeek}
        </button>
      </div>

      <button className="btn-primary journal-add-btn" onClick={() => setView('upload')}>
        + Add a photo
      </button>

      {loading ? (
        <p className="journal-loading">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="milestone-empty">
          <p className="milestone-empty-text">
            {filter === FILTER_WEEK
              ? `No photos tagged for week ${currentWeek} yet.`
              : 'No photos yet. Tap the button above to add your first memory!'}
          </p>
        </div>
      ) : (
        <div className="journal-grid" role="list" aria-label="Photo journal">
          {visible.map(entry => (
            <button
              key={entry.id}
              className="journal-grid-item"
              onClick={() => openDetail(entry)}
              role="listitem"
              aria-label={entry.caption ?? `Journal photo from week ${entry.weekNumber ?? 'unknown'}`}
            >
              <img src={entry.photoUrl} alt="" className="journal-thumb" loading="lazy" />
              {entry.weekNumber && (
                <span className="journal-thumb-week">W{entry.weekNumber}</span>
              )}
              {entry.caption && (
                <p className="journal-thumb-caption">{entry.caption}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

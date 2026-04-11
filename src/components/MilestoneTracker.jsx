import React, { useState } from 'react'
import { useMilestones } from '../hooks/useMilestones.js'
import MilestoneForm from './MilestoneForm.jsx'

/**
 * Formats an ISO date string (YYYY-MM-DD) as a human-readable date.
 * @param {string} iso
 */
function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Main milestone tracker screen.
 * Orchestrates list view, add form, and edit form.
 */
export default function MilestoneTracker() {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useMilestones()
  const [view, setView] = useState('list') // 'list' | 'add' | 'edit'
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const sorted = [...milestones].sort((a, b) => b.achievedAt.localeCompare(a.achievedAt))

  function handleAdd(name, achievedAt, note) {
    addMilestone(name, achievedAt, note)
    setView('list')
  }

  function handleEdit(name, achievedAt, note) {
    updateMilestone(editing.id, { name, achievedAt, note })
    setEditing(null)
    setView('list')
  }

  function handleDeleteConfirm(id) {
    deleteMilestone(id)
    setConfirmDelete(null)
  }

  if (view === 'add') {
    return (
      <div className="milestone-screen">
        <MilestoneForm
          onSave={handleAdd}
          onCancel={() => setView('list')}
        />
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div className="milestone-screen">
        <MilestoneForm
          initial={editing}
          onSave={handleEdit}
          onCancel={() => { setEditing(null); setView('list') }}
        />
      </div>
    )
  }

  return (
    <div className="milestone-screen">
      <div className="milestone-header">
        <h1 className="milestone-heading">Milestones</h1>
        <p className="milestone-subheading">
          Every big first — free, forever.
        </p>
      </div>

      <button
        className="btn-primary milestone-add-btn"
        onClick={() => setView('add')}
      >
        + Log a milestone
      </button>

      {sorted.length === 0 ? (
        <div className="milestone-empty">
          <p className="milestone-empty-text">
            No milestones yet. Tap the button above to log your baby's first big moments!
          </p>
        </div>
      ) : (
        <ol className="milestone-list" aria-label="Milestones timeline">
          {sorted.map(m => (
            <li key={m.id} className="milestone-item">
              <div className="milestone-dot" aria-hidden="true" />
              <div className="milestone-content">
                <p className="milestone-name">{m.name}</p>
                <p className="milestone-date">{formatDate(m.achievedAt)}</p>
                {m.note && <p className="milestone-note">{m.note}</p>}
                <div className="milestone-actions">
                  <button
                    className="btn-ghost milestone-action"
                    onClick={() => { setEditing(m); setView('edit') }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-ghost milestone-action milestone-action--delete"
                    onClick={() => setConfirmDelete(m.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {confirmDelete && (
        <div className="milestone-dialog-backdrop" onClick={() => setConfirmDelete(null)}>
          <div
            className="milestone-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm delete"
            onClick={e => e.stopPropagation()}
          >
            <p className="milestone-dialog-text">Delete this milestone?</p>
            <div className="milestone-dialog-actions">
              <button
                className="btn-primary milestone-dialog-delete"
                onClick={() => handleDeleteConfirm(confirmDelete)}
              >
                Delete
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

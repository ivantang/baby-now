import React from 'react'
import { motion } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AccountScreen({ babyName, currentWeek, onOpenSettings, onOpenUpgrade, onOpenSignIn }) {
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    try { await signOut() } catch {}
  }

  return (
    <div className="account-screen">
      <h2 className="screen-title">Account</h2>

      {/* Baby card */}
      <div className="account-baby-card">
        <div className="account-baby-icon">🍼</div>
        <div className="account-baby-info">
          <div className="account-baby-name">{babyName || 'Your baby'}</div>
          <div className="account-baby-week">Week {currentWeek}</div>
        </div>
        <button className="account-edit-btn" onClick={onOpenSettings}>
          Edit
        </button>
      </div>

      {/* Subscription */}
      <div className="account-sub-card">
        <div className="account-sub-info">
          <div className="account-sub-status">Free Trial</div>
          <div className="account-sub-desc">AI Chat included · 3-day trial</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="account-upgrade-pill"
          onClick={onOpenUpgrade}
        >
          Upgrade
        </motion.button>
      </div>

      {/* Menu */}
      <div className="account-menu">
        <button className="account-menu-item" onClick={onOpenSettings}>
          <span>Settings</span>
          <span className="account-menu-chevron">›</span>
        </button>

        {user ? (
          <>
            <div className="account-menu-item account-menu-item--info">
              <span className="account-menu-email">{user.email}</span>
            </div>
            <button className="account-menu-item account-menu-item--danger" onClick={handleSignOut}>
              <span>Sign out</span>
            </button>
          </>
        ) : (
          <button className="account-menu-item" onClick={onOpenSignIn}>
            <span>Sign in to sync & back up</span>
            <span className="account-menu-chevron">›</span>
          </button>
        )}
      </div>
    </div>
  )
}

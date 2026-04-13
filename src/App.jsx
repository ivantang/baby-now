import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { useBabyProfile } from './hooks/useBabyProfile.js'
import BirthdaySetup from './components/BirthdaySetup.jsx'
import WeekHeroCard from './components/WeekHeroCard.jsx'
import PhotoJournal from './components/PhotoJournal.jsx'
import AuthGate from './components/auth/AuthGate.jsx'
import AccountScreen from './components/auth/AccountScreen.jsx'

function AppShell() {
  const { user } = useAuth()
  const { babyName, currentWeek, setProfile, clearProfile } = useBabyProfile()
  const [tab, setTab] = useState('week')
  const [showAuth, setShowAuth] = useState(false)

  // Show auth gate when user explicitly navigates to Account while signed out
  if (showAuth && !user) {
    return <AuthGate onSkip={() => setShowAuth(false)} />
  }

  if (!currentWeek) {
    return <BirthdaySetup onSave={setProfile} />
  }

  return (
    <div className="app-shell">
      <main className="app">
        {tab === 'week' && (
          <WeekHeroCard
            babyName={babyName}
            currentWeek={currentWeek}
            onChangeBirthday={clearProfile}
          />
        )}
        {tab === 'journal' && <PhotoJournal currentWeek={currentWeek} />}
        {tab === 'account' && (
          user
            ? <AccountScreen />
            : <AuthGate onSkip={() => setTab('week')} />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        <button
          className={`bottom-nav-btn${tab === 'week' ? ' bottom-nav-btn--active' : ''}`}
          onClick={() => setTab('week')}
          aria-current={tab === 'week' ? 'page' : undefined}
        >
          <span className="bottom-nav-icon" aria-hidden="true">🍼</span>
          <span className="bottom-nav-label">This week</span>
        </button>
        <button
          className={`bottom-nav-btn${tab === 'journal' ? ' bottom-nav-btn--active' : ''}`}
          onClick={() => setTab('journal')}
          aria-current={tab === 'journal' ? 'page' : undefined}
        >
          <span className="bottom-nav-icon" aria-hidden="true">📷</span>
          <span className="bottom-nav-label">Journal</span>
        </button>
        <button
          className={`bottom-nav-btn${tab === 'account' ? ' bottom-nav-btn--active' : ''}`}
          onClick={() => setTab('account')}
          aria-current={tab === 'account' ? 'page' : undefined}
        >
          <span className="bottom-nav-icon" aria-hidden="true">👤</span>
          <span className="bottom-nav-label">Account</span>
        </button>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

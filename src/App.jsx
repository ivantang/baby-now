import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { useBabyProfile } from './hooks/useBabyProfile.js'
import BirthdaySetup from './components/BirthdaySetup.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import WeekSelector from './components/WeekSelector.jsx'
import WeekContent from './components/WeekContent.jsx'
import MilestonesScreen from './components/MilestonesScreen.jsx'
import PhotoJournal from './components/PhotoJournal.jsx'
import AIChat from './components/AIChat.jsx'
import AuthGate from './components/auth/AuthGate.jsx'
import AccountScreen from './components/auth/AccountScreen.jsx'

// ── Bottom navigation ────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: 'home',       label: 'Home',       icon: '🏠' },
  { id: 'weeks',      label: 'Weeks',      icon: '📅' },
  { id: 'milestones', label: 'Milestones', icon: '🏅' },
  { id: 'photos',     label: 'Photos',     icon: '📷' },
  { id: 'account',    label: 'Account',    icon: '👤' },
]

function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            className={`bottom-nav-btn${isActive ? ' bottom-nav-btn--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="bottom-nav-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="bottom-nav-icon" aria-hidden="true">{tab.icon}</span>
            <span className="bottom-nav-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// ── App shell ────────────────────────────────────────────────────────────────

function AppShell() {
  const { user } = useAuth()
  const { babyName, currentWeek, setProfile, clearProfile } = useBabyProfile()
  const [tab, setTab] = useState('home')
  const [selectedWeek, setSelectedWeek] = useState(null)

  if (!currentWeek) {
    return <BirthdaySetup onSave={setProfile} />
  }

  // Show auth gate for account tab when signed out
  if (tab === 'account' && !user) {
    return <AuthGate onSkip={() => setTab('home')} />
  }

  function handleTabChange(newTab) {
    setTab(newTab)
    if (newTab !== 'weeks') setSelectedWeek(null)
  }

  return (
    <div className="app-shell">
      <main className="app">
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div key="home"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <HomeScreen
                babyName={babyName}
                currentWeek={currentWeek}
                onChangeBirthday={clearProfile}
                onGoToChat={() => setTab('account')}
              />
            </motion.div>
          )}

          {tab === 'weeks' && (
            <motion.div key="weeks"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {selectedWeek
                ? <WeekContent week={selectedWeek} onBack={() => setSelectedWeek(null)} />
                : <WeekSelector currentWeek={currentWeek} onWeekSelect={setSelectedWeek} />
              }
            </motion.div>
          )}

          {tab === 'milestones' && (
            <motion.div key="milestones"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <MilestonesScreen />
            </motion.div>
          )}

          {tab === 'photos' && (
            <motion.div key="photos"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <PhotoJournal currentWeek={currentWeek} />
            </motion.div>
          )}

          {tab === 'account' && user && (
            <motion.div key="account"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <AccountScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={tab} onTabChange={handleTabChange} />
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

import React, { useState } from 'react'
import { useBabyProfile } from './hooks/useBabyProfile.js'
import BirthdaySetup from './components/BirthdaySetup.jsx'
import WeekHeroCard from './components/WeekHeroCard.jsx'
import MilestoneTracker from './components/MilestoneTracker.jsx'

export default function App() {
  const { babyName, currentWeek, setProfile, clearProfile } = useBabyProfile()
  const [tab, setTab] = useState('week')

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
        {tab === 'milestones' && <MilestoneTracker />}
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
          className={`bottom-nav-btn${tab === 'milestones' ? ' bottom-nav-btn--active' : ''}`}
          onClick={() => setTab('milestones')}
          aria-current={tab === 'milestones' ? 'page' : undefined}
        >
          <span className="bottom-nav-icon" aria-hidden="true">⭐</span>
          <span className="bottom-nav-label">Milestones</span>
        </button>
      </nav>
    </div>
  )
}

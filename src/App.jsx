import React from 'react'
import { useBabyProfile } from './hooks/useBabyProfile.js'
import BirthdaySetup from './components/BirthdaySetup.jsx'
import WeekHeroCard from './components/WeekHeroCard.jsx'

export default function App() {
  const { babyName, currentWeek, setProfile, clearProfile } = useBabyProfile()

  if (!currentWeek) {
    return <BirthdaySetup onSave={setProfile} />
  }

  return (
    <main className="app">
      <WeekHeroCard
        babyName={babyName}
        currentWeek={currentWeek}
        onChangeBirthday={clearProfile}
      />
    </main>
  )
}

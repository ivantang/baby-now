import React from 'react'
import { getWeek, getAllWeeks, getFullWeeks } from './data/index.js'

export default function App() {
  const allWeeks = getAllWeeks()
  const fullWeeks = getFullWeeks()
  const week8 = getWeek(8)

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Baby Week by Week</h1>
      <p>Total weeks loaded: {allWeeks.length}</p>
      <p>Weeks with full content: {fullWeeks.length} (weeks 4–16)</p>
      {week8 && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#faf6f0', borderRadius: '8px' }}>
          <h2>{week8.title}</h2>
          <p>{week8.highlight}</p>
        </div>
      )}
    </div>
  )
}

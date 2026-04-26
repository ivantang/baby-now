import React, { useState } from 'react'
import { motion } from 'motion/react'

const FEATURES = [
  '20 AI chat messages per day',
  'Context-aware — knows your baby\'s week & milestones',
  'Warm, reassuring answers on sleep, feeding & more',
  'Everything else stays free forever',
]

export default function UpgradeScreen({ onBack }) {
  const [selectedPlan, setSelectedPlan] = useState('annual')

  return (
    <motion.div
      className="upgrade-screen"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25 }}
    >
      <div className="upgrade-header">
        <button className="settings-back-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
      </div>

      <div className="upgrade-body">
        <div className="upgrade-icon-wrap">
          <span className="upgrade-icon">✨</span>
        </div>

        <h2 className="upgrade-title">Unlock AI Chat</h2>
        <p className="upgrade-subtitle">
          Get personalised answers about your baby's sleep, feeding, milestones and more.
        </p>

        <ul className="upgrade-features">
          {FEATURES.map(f => (
            <li key={f} className="upgrade-feature-item">
              <span className="upgrade-check">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="upgrade-plans">
          <button
            className={`upgrade-plan${selectedPlan === 'annual' ? ' upgrade-plan--selected' : ''}`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="upgrade-plan-best-badge">Best value</div>
            <div className="upgrade-plan-name">Annual</div>
            <div className="upgrade-plan-price">
              $2.08<span className="upgrade-plan-per">/month</span>
            </div>
            <div className="upgrade-plan-billing">$24.99 billed yearly</div>
          </button>

          <button
            className={`upgrade-plan${selectedPlan === 'monthly' ? ' upgrade-plan--selected' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="upgrade-plan-best-badge upgrade-plan-best-badge--hidden">&#8203;</div>
            <div className="upgrade-plan-name">Monthly</div>
            <div className="upgrade-plan-price">
              $3.99<span className="upgrade-plan-per">/month</span>
            </div>
            <div className="upgrade-plan-billing">billed monthly</div>
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="upgrade-cta-btn"
        >
          Start 3-day free trial
        </motion.button>

        <p className="upgrade-disclaimer">
          No credit card required · Cancel anytime
        </p>

        <p className="upgrade-free-note">
          Week content, milestones, and photos are free forever.
        </p>
      </div>
    </motion.div>
  )
}

import React from 'react'
import { motion } from 'motion/react'

/**
 * AI Chat tab — shows paywall upsell (no subscription yet).
 * When hasAccess is true, shows a basic chat UI shell.
 *
 * @param {{ hasAccess?: boolean }} props
 */
export default function AIChat({ hasAccess = false }) {
  if (!hasAccess) {
    return (
      <div className="aichat-screen">
        <h2 className="screen-title">AI Chat</h2>

        <div className="aichat-paywall">
          <div className="aichat-sparkle-icon">✨</div>

          <h3 className="aichat-paywall-title">Get personalised advice</h3>
          <p className="aichat-paywall-body">
            Chat with an AI assistant trained on baby development. Ask about sleep, feeding, milestones, or anything on your mind.
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="aichat-trial-btn"
          >
            Start 3-day free trial
          </motion.button>

          <p className="aichat-disclaimer">No credit card required</p>
        </div>
      </div>
    )
  }

  // Active chat UI
  return (
    <div className="aichat-screen aichat-screen--active">
      <h2 className="screen-title">AI Chat</h2>

      <div className="aichat-messages">
        <div className="aichat-message aichat-message--ai">
          <div className="aichat-avatar">✨</div>
          <div className="aichat-bubble">
            <div className="aichat-sender">AI Assistant</div>
            <p className="aichat-text">
              Hi! I'm here to help with any questions about your baby's development. What would you like to know?
            </p>
          </div>
        </div>
      </div>

      <div className="aichat-input-bar">
        <input
          type="text"
          className="aichat-input"
          placeholder="Ask about sleep, feeding, milestones…"
        />
      </div>
    </div>
  )
}

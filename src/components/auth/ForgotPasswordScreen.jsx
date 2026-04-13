import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function ForgotPasswordScreen({ onBack }) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-screen">
        <h1>Email sent</h1>
        <p>Check your inbox for a password reset link.</p>
        <button type="button" onClick={onBack} className="auth-link">
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="auth-screen">
      <h1>Reset password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <button type="button" onClick={onBack} className="auth-link">
        Back to sign in
      </button>
    </div>
  )
}

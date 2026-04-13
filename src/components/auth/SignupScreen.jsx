import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function SignupScreen({ onSkip, onSwitchToLogin }) {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signUp(email, password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="auth-screen">
        <h1>Check your email</h1>
        <p>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        <button type="button" onClick={onSwitchToLogin} className="auth-link">
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="auth-screen">
      <h1>Create account</h1>
      <p className="auth-trial-note">Try free for 3 days, then just $2/month.</p>
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
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Start free trial'}
        </button>
      </form>
      <button type="button" onClick={onSwitchToLogin} className="auth-link">
        Already have an account? Sign in
      </button>
      <button type="button" onClick={onSkip} className="auth-skip">
        Continue without signing in
      </button>
    </div>
  )
}

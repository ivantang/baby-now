import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function LoginScreen({ onSkip, onSwitchToSignup, onForgotPassword }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <h1>Sign in</h1>
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
            autoComplete="current-password"
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <button type="button" onClick={onForgotPassword} className="auth-link">
        Forgot password?
      </button>
      <button type="button" onClick={onSwitchToSignup} className="auth-link">
        Create an account
      </button>
      <button type="button" onClick={onSkip} className="auth-skip">
        Continue without signing in
      </button>
    </div>
  )
}

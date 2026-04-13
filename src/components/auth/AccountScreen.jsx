import React from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AccountScreen() {
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed:', err.message)
    }
  }

  return (
    <div className="auth-screen">
      <h1>Account</h1>
      <p>{user?.email}</p>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  )
}

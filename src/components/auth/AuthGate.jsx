import React, { useState } from 'react'
import LoginScreen from './LoginScreen.jsx'
import SignupScreen from './SignupScreen.jsx'
import ForgotPasswordScreen from './ForgotPasswordScreen.jsx'

export default function AuthGate({ onSkip }) {
  const [screen, setScreen] = useState('login')

  if (screen === 'signup') {
    return (
      <SignupScreen
        onSkip={onSkip}
        onSwitchToLogin={() => setScreen('login')}
      />
    )
  }

  if (screen === 'forgot') {
    return (
      <ForgotPasswordScreen
        onBack={() => setScreen('login')}
      />
    )
  }

  return (
    <LoginScreen
      onSkip={onSkip}
      onSwitchToSignup={() => setScreen('signup')}
      onForgotPassword={() => setScreen('forgot')}
    />
  )
}

"use client"

import { useEffect, useState } from 'react'
import { isOnboardingDone } from '@/lib/userSettings'
import OnboardingScreen from './OnboardingScreen'

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    setShowOnboarding(!isOnboardingDone())
    setReady(true)
  }, [])

  if (!ready) return null

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />
  }

  return <>{children}</>
}

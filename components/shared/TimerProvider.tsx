"use client"

import { useEffect } from 'react'
import { useTimerStore } from '@/store/timerStore'

/**
 * Global timer ticker — mounted once in layout so the countdown keeps running
 * even when the user navigates away from the /enfoque page.
 */
export function TimerProvider({ children }: { children: React.ReactNode }) {
  const tickTimer = useTimerStore((s) => s.tickTimer)
  const status = useTimerStore((s) => s.timer.status)

  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => tickTimer(), 1000)
    return () => clearInterval(interval)
  }, [status, tickTimer])

  return <>{children}</>
}

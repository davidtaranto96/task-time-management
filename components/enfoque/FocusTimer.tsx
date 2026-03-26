"use client"

import { useEffect } from 'react'
import type { TimerMode, TimerStatus } from '@/types/timer'
import { TIMER_LABELS } from '@/types/timer'

interface FocusTimerProps {
  remainingSeconds: number
  totalSeconds: number
  status: TimerStatus
  mode: TimerMode
  isBreak?: boolean
  onTick: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getArcColor(mode: TimerMode): string {
  if (mode === 'break_5' || mode === 'break_10' || mode === 'break_15') {
    return '#22c55e' // ae-success green
  }
  if (mode === 'quick_5') {
    return '#3b82f6' // ae-info blue
  }
  return '#f59e0b' // ae-primordial amber
}

export function FocusTimer({ remainingSeconds, totalSeconds, status, mode, isBreak = false, onTick }: FocusTimerProps) {
  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => {
      onTick()
    }, 1000)
    return () => clearInterval(interval)
  }, [status, onTick])

  const size = 240
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0
  const dashOffset = circumference * (1 - progress)
  const arcColor = isBreak ? '#22c55e' : getArcColor(mode)
  const isCompleted = status === 'completed'
  const isRunning = status === 'running'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2a2a35"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={isRunning ? 'transition-all duration-1000 ease-linear' : 'transition-all duration-300'}
            style={
              isRunning
                ? {
                    filter: `drop-shadow(0 0 8px ${arcColor}88)`,
                  }
                : undefined
            }
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isCompleted ? (
            <span className="text-5xl text-green-400">✓</span>
          ) : (
            <span className="font-mono text-4xl font-bold text-ae-text tabular-nums">
              {formatTime(remainingSeconds)}
            </span>
          )}
        </div>
      </div>

      {/* Mode label */}
      <p className="text-sm text-ae-text-muted">{TIMER_LABELS[mode]}</p>
    </div>
  )
}

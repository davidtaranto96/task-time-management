"use client"

import { useEffect, useState } from 'react'
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

function getColors(mode: TimerMode, isBreak: boolean) {
  if (isBreak || mode.startsWith('break')) return { arc: '#22c55e', glow: '#22c55e' }
  if (mode === 'quick_5') return { arc: '#3b82f6', glow: '#3b82f6' }
  return { arc: '#f59e0b', glow: '#f59e0b' }
}

const STATUS_LABEL: Record<TimerStatus, string> = {
  idle: '● READY',
  running: '▶ RUNNING',
  paused: '⏸ PAUSED',
  completed: '★ CLEAR!',
}

export function FocusTimer({ remainingSeconds, totalSeconds, status, mode, isBreak = false, onTick }: FocusTimerProps) {
  const [colonVisible, setColonVisible] = useState(true)

  // Tick
  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => { onTick() }, 1000)
    return () => clearInterval(interval)
  }, [status, onTick])

  // Blink colon while running
  useEffect(() => {
    if (status !== 'running') { setColonVisible(true); return }
    const t = setInterval(() => setColonVisible(v => !v), 500)
    return () => clearInterval(t)
  }, [status])

  const size = 220
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0
  const dashOffset = circumference * (1 - progress)

  const { arc: arcColor, glow: glowColor } = getColors(mode, isBreak)
  const isCompleted = status === 'completed'
  const isRunning = status === 'running'

  const m = Math.floor(remainingSeconds / 60)
  const s = remainingSeconds % 60
  const minutes = String(m).padStart(2, '0')
  const secs = String(s).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Retro CRT frame */}
      <div
        style={{
          background: '#080810',
          border: `3px solid ${glowColor}`,
          boxShadow: `0 0 0 1px #000, 0 0 24px ${glowColor}55, 0 0 60px ${glowColor}22, inset 0 0 30px #00000099`,
          padding: '6px',
          position: 'relative',
        }}
      >
        {/* Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Corner pixels */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2.5 h-2.5`}
            style={{ background: glowColor, zIndex: 11 }}
          />
        ))}

        {/* SVG progress ring */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track with tick marks */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1c1c28" strokeWidth={strokeWidth} />
          {/* Progress arc — squared linecap for pixel feel */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            style={{ filter: isRunning ? `drop-shadow(0 0 5px ${arcColor}) drop-shadow(0 0 12px ${arcColor}88)` : 'none' }}
            className={isRunning ? 'transition-all duration-1000 ease-linear' : 'transition-all duration-300'}
          />
        </svg>

        {/* Center digital display */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 5 }}
        >
          {isCompleted ? (
            <div style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#22c55e',
              textShadow: '0 0 10px #22c55e, 0 0 30px #22c55e88, 0 0 60px #22c55e44',
              letterSpacing: '0.08em',
            }}>
              DONE!
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '3.8rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: arcColor,
                textShadow: `0 0 8px ${arcColor}, 0 0 20px ${arcColor}99, 0 0 40px ${arcColor}44`,
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {minutes}
                <span style={{ opacity: colonVisible ? 1 : 0.15, transition: 'opacity 0.1s' }}>:</span>
                {secs}
              </div>
              <div style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.55rem',
                letterSpacing: '0.25em',
                color: glowColor + '99',
                marginTop: '10px',
                textTransform: 'uppercase',
              }}>
                {STATUS_LABEL[status]}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Retro mode label */}
      <p style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: glowColor + 'aa',
        textTransform: 'uppercase',
      }}>
        [ {TIMER_LABELS[mode]} ]
      </p>
    </div>
  )
}

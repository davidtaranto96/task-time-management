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

export function FocusTimer({ remainingSeconds, totalSeconds, status, mode, isBreak = false }: FocusTimerProps) {
  const [colonVisible, setColonVisible] = useState(true)

  // Tick is now handled globally by TimerProvider in layout — no local interval needed.

  // Blink colon while running
  useEffect(() => {
    if (status !== 'running') { setColonVisible(true); return }
    const t = setInterval(() => setColonVisible(v => !v), 500)
    return () => clearInterval(t)
  }, [status])

  const size = 210
  const strokeWidth = 13
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
    <div className="flex flex-col items-center gap-3">
      {/* Retro CRT frame — rounded corners, layered glow */}
      <div
        style={{
          background: 'radial-gradient(ellipse at center, #0d0d1a 60%, #060610 100%)',
          border: `2px solid ${glowColor}88`,
          borderRadius: '16px',
          boxShadow: [
            `0 0 0 1px #000`,
            `0 0 16px ${glowColor}44`,
            `0 0 40px ${glowColor}1a`,
            `inset 0 0 40px #00000088`,
            isRunning ? `0 0 60px ${glowColor}22` : '',
          ].filter(Boolean).join(', '),
          padding: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: '14px',
          }}
        />

        {/* Corner accent dots */}
        {[
          { top: 6, left: 6 }, { top: 6, right: 6 },
          { bottom: 6, left: 6 }, { bottom: 6, right: 6 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 5, height: 5,
              borderRadius: 1,
              background: glowColor,
              opacity: 0.8,
              zIndex: 11,
              ...pos,
            }}
          />
        ))}

        {/* SVG progress ring */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke={glowColor + '18'}
            strokeWidth={strokeWidth + 2}
          />
          {/* Track */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke="#1a1a2e"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            style={{
              filter: isRunning
                ? `drop-shadow(0 0 4px ${arcColor}) drop-shadow(0 0 10px ${arcColor}99)`
                : `drop-shadow(0 0 2px ${arcColor}66)`,
            }}
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
              fontSize: '2.4rem',
              fontWeight: 900,
              color: '#22c55e',
              textShadow: '0 0 12px #22c55e, 0 0 32px #22c55e88',
              letterSpacing: '0.06em',
            }}>
              DONE!
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '4.2rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                color: arcColor,
                textShadow: `0 0 10px ${arcColor}, 0 0 24px ${arcColor}88, 0 0 48px ${arcColor}33`,
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {minutes}
                <span style={{ opacity: colonVisible ? 1 : 0.1, transition: 'opacity 0.15s' }}>:</span>
                {secs}
              </div>
              <div style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.5rem',
                letterSpacing: '0.3em',
                color: glowColor + 'bb',
                marginTop: '8px',
                textTransform: 'uppercase',
              }}>
                {STATUS_LABEL[status]}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mode label */}
      <p style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.22em',
        color: glowColor + '99',
        textTransform: 'uppercase',
      }}>
        ▸ {TIMER_LABELS[mode]} ◂
      </p>
    </div>
  )
}

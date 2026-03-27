"use client"

import type { TimerMode } from '@/types/timer'
import { hapticLight } from '@/lib/haptics'

interface TimerModeSelectorProps {
  selectedMode: TimerMode
  onChange: (mode: TimerMode) => void
  disabled?: boolean
}

const WORK_MODES: { mode: TimerMode; label: string; sub: string; icon: string }[] = [
  { mode: 'pomodoro_25', label: '25 min', sub: '+ 5 min pausa', icon: '🍅' },
  { mode: 'pomodoro_50', label: '50 min', sub: '+ 10 min pausa', icon: '🔥' },
  { mode: 'deep_work_90', label: '90 min', sub: '+ 15 min pausa', icon: '🧠' },
  { mode: 'quick_5',     label: '5 min',  sub: 'sesión rápida',  icon: '⚡' },
]


export function TimerModeSelector({ selectedMode, onChange, disabled }: TimerModeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {WORK_MODES.map(({ mode, label, icon }) => {
        const isSelected = selectedMode === mode
        return (
          <button
            key={mode}
            onClick={() => { hapticLight(); onChange(mode) }}
            disabled={disabled}
            className={[
              'rounded-xl py-2 text-center transition-all active:scale-95 flex flex-col items-center gap-0.5',
              isSelected
                ? 'bg-amber-500/20 border border-amber-500/60'
                : 'bg-ae-surface border border-ae-border',
              disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
            ].join(' ')}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className={`text-xs font-semibold ${isSelected ? 'text-amber-400' : 'text-ae-text'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

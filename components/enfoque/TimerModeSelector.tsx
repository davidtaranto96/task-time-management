"use client"

import type { TimerMode } from '@/types/timer'

interface TimerModeSelectorProps {
  selectedMode: TimerMode
  onChange: (mode: TimerMode) => void
  disabled?: boolean
}

const WORK_MODES: { mode: TimerMode; label: string }[] = [
  { mode: 'pomodoro_25', label: '25 min' },
  { mode: 'pomodoro_50', label: '50 min' },
  { mode: 'deep_work_90', label: '90 min' },
  { mode: 'quick_5', label: '5 min rápido' },
]

const BREAK_MODES: { mode: TimerMode; label: string }[] = [
  { mode: 'break_5', label: '5 min pausa' },
  { mode: 'break_10', label: '10 min' },
  { mode: 'break_15', label: '15 min' },
]

export function TimerModeSelector({ selectedMode, onChange, disabled }: TimerModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Work modes */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {WORK_MODES.map(({ mode, label }) => {
          const isSelected = selectedMode === mode
          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              disabled={disabled}
              className={[
                'flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-amber-500 text-black'
                  : 'bg-ae-surface-2 text-ae-text-muted hover:text-ae-text',
                disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Break modes (smaller) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {BREAK_MODES.map(({ mode, label }) => {
          const isSelected = selectedMode === mode
          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              disabled={disabled}
              className={[
                'flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                isSelected
                  ? 'bg-green-500 text-black'
                  : 'bg-ae-surface-2 text-ae-text-muted hover:text-ae-text',
                disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

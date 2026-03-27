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

const BREAK_MODES: { mode: TimerMode; label: string; icon: string }[] = [
  { mode: 'break_5',  label: '5 min',  icon: '☕' },
  { mode: 'break_10', label: '10 min', icon: '🌿' },
  { mode: 'break_15', label: '15 min', icon: '😴' },
]

export function TimerModeSelector({ selectedMode, onChange, disabled }: TimerModeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Work modes — 2x2 grid, always visible */}
      <div className="grid grid-cols-2 gap-2">
        {WORK_MODES.map(({ mode, label, sub, icon }) => {
          const isSelected = selectedMode === mode
          return (
            <button
              key={mode}
              onClick={() => { hapticLight(); onChange(mode) }}
              disabled={disabled}
              className={[
                'rounded-xl px-3 py-2.5 text-left transition-all active:scale-95',
                isSelected
                  ? 'bg-amber-500/20 border border-amber-500/60 ring-1 ring-amber-500/40'
                  : 'bg-ae-surface border border-ae-border hover:border-ae-text-muted/50',
                disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{icon}</span>
                <span className={`text-sm font-semibold ${isSelected ? 'text-amber-400' : 'text-ae-text'}`}>
                  {label}
                </span>
              </div>
              <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-amber-400/70' : 'text-ae-text-muted'}`}>
                {sub}
              </span>
            </button>
          )
        })}
      </div>

      {/* Break modes — 3 columns */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-widest text-ae-text-muted px-1">Descanso manual</span>
        <div className="grid grid-cols-3 gap-2">
          {BREAK_MODES.map(({ mode, label, icon }) => {
            const isSelected = selectedMode === mode
            return (
              <button
                key={mode}
                onClick={() => { hapticLight(); onChange(mode) }}
                disabled={disabled}
                className={[
                  'rounded-xl px-2 py-2 text-center transition-all active:scale-95',
                  isSelected
                    ? 'bg-green-500/20 border border-green-500/60 ring-1 ring-green-500/40'
                    : 'bg-ae-surface border border-ae-border hover:border-ae-text-muted/50',
                  disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                ].join(' ')}
              >
                <span className="block text-base">{icon}</span>
                <span className={`block text-xs font-medium mt-0.5 ${isSelected ? 'text-green-400' : 'text-ae-text-muted'}`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

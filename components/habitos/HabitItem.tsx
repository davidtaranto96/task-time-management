'use client'

import { useState } from 'react'
import type { Habit } from '@/types/habit'
import { AREAS } from '@/types/area'
import StreakBadge from './StreakBadge'

interface HabitItemProps {
  habit: Habit
  isCompleted: boolean
  streak: number
  onToggle: () => void
  onArchive: () => void
}

export default function HabitItem({ habit, isCompleted, streak, onToggle, onArchive }: HabitItemProps) {
  const [showArchive, setShowArchive] = useState(false)
  const area = habit.area ? AREAS[habit.area] : null

  return (
    <div
      className="relative flex items-center gap-3 rounded-xl bg-ae-surface px-4 py-3"
      onContextMenu={(e) => { e.preventDefault(); setShowArchive((v) => !v) }}
    >
      {/* Toggle circle */}
      <button
        onClick={onToggle}
        className={`cursor-pointer flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isCompleted
            ? 'border-ae-success bg-ae-success/20 text-ae-success hover:bg-ae-success/10'
            : 'border-ae-border bg-transparent text-transparent hover:border-ae-success/50'
        }`}
        aria-label={isCompleted ? 'Marcar incompleto' : 'Marcar completo'}
      >
        {isCompleted && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Center: title + badges */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={`truncate font-semibold text-ae-text ${isCompleted ? 'line-through opacity-50' : ''}`}>
          {habit.icon && <span className="mr-1">{habit.icon}</span>}
          {habit.title}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Frequency badge */}
          {habit.frequency === 'daily' ? (
            <span className="rounded-full bg-ae-success/15 px-2 py-0.5 text-xs font-medium text-ae-success">
              Diario
            </span>
          ) : (
            <span className="rounded-full bg-ae-info/15 px-2 py-0.5 text-xs font-medium text-ae-info">
              Semanal
            </span>
          )}
          {/* Area badge */}
          {area && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${area.color}22`, color: area.color }}
            >
              {area.icon} {area.name}
            </span>
          )}
        </div>
      </div>

      {/* Right: streak */}
      {streak > 0 && (
        <div className="shrink-0">
          <StreakBadge streak={streak} size="sm" />
        </div>
      )}

      {/* Archive overlay */}
      {showArchive && (
        <div className="absolute inset-0 flex items-center justify-end gap-2 rounded-xl bg-ae-bg/90 px-4">
          <span className="text-sm text-ae-text-muted">¿Archivar?</span>
          <button
            onClick={() => { onArchive(); setShowArchive(false) }}
            className="rounded-lg bg-ae-danger/20 px-3 py-1.5 text-sm font-medium text-ae-danger hover:bg-ae-danger/30"
          >
            Archivar
          </button>
          <button
            onClick={() => setShowArchive(false)}
            className="rounded-lg bg-ae-surface-2 px-3 py-1.5 text-sm font-medium text-ae-text-muted hover:text-ae-text"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

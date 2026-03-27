"use client"

import Link from 'next/link'
import type { Habit } from '@/types/habit'
import { hapticLight } from '@/lib/haptics'

interface HabitRowProps {
  habits: Habit[]
  todayId: string
  isCompleted: (habitId: string, dayId: string) => boolean
  onToggle: (habitId: string) => void
  getStreak: (habitId: string) => number
}

export default function HabitRow({ habits, todayId, isCompleted, onToggle, getStreak }: HabitRowProps) {
  if (habits.length === 0) {
    return (
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-ae-text-muted">No tenés hábitos aún</p>
        <Link
          href="/habitos"
          className="text-sm text-ae-primordial hover:text-ae-primordial/80 font-medium transition-colors"
        >
          Crear hábitos →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {habits.map((habit) => {
        const done = isCompleted(habit.id, todayId)
        const streak = getStreak(habit.id)
        const initial = habit.title.charAt(0).toUpperCase()

        return (
          <button
            key={habit.id}
            onClick={() => { hapticLight(); onToggle(habit.id) }}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 w-20"
          >
            {/* Circle */}
            <div
              className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
                done
                  ? 'ring-2 ring-ae-success ring-offset-2 ring-offset-ae-bg bg-ae-success/10'
                  : 'ring-2 ring-ae-border bg-ae-surface-2 hover:ring-ae-primordial/50'
              }`}
            >
              {habit.icon ? (
                <span className="text-xl leading-none">{habit.icon}</span>
              ) : (
                <span className="text-sm font-bold text-ae-text">{initial}</span>
              )}
              {done && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-ae-success rounded-full flex items-center justify-center text-white text-xs leading-none">
                  ✓
                </span>
              )}
            </div>

            {/* Title */}
            <span className="text-xs text-ae-text-muted text-center w-full line-clamp-2 break-words leading-tight">
              {habit.title}
            </span>

            {/* Streak badge */}
            {streak > 0 && (
              <span className="text-xs text-ae-primordial font-medium leading-none">
                🔥{streak}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

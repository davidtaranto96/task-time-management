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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {habits.map((habit) => {
        const done = isCompleted(habit.id, todayId)
        const streak = getStreak(habit.id)

        return (
          <button
            key={habit.id}
            onClick={() => { hapticLight(); onToggle(habit.id) }}
            className={`flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3 w-[90px] min-h-[88px] border-2 transition-all active:scale-95 ${
              done
                ? 'bg-ae-success/10 border-ae-success'
                : 'bg-ae-surface border-ae-border hover:border-ae-primordial/50'
            }`}
          >
            {/* Icon */}
            <span className="text-2xl leading-none">
              {habit.icon ?? habit.title.charAt(0).toUpperCase()}
            </span>

            {/* Title */}
            <span className={`text-xs text-center leading-tight w-full line-clamp-2 break-words ${
              done ? 'text-ae-success' : 'text-ae-text-muted'
            }`}>
              {habit.title}
            </span>

            {/* Streak or done check */}
            {done ? (
              <span className="text-xs text-ae-success font-bold">✓</span>
            ) : streak > 0 ? (
              <span className="text-xs text-ae-primordial font-medium leading-none">🔥{streak}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

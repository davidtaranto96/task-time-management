'use client'

import { useEffect, useState } from 'react'
import { useHabitStore } from '@/store/habitStore'
import { getTodayId, getLastNDays } from '@/lib/dateUtils'
import { isHabitDueToday } from '@/lib/habitUtils'
import type { AreaKey } from '@/types/area'
import HabitItem from '@/components/habitos/HabitItem'
import WeekGrid from '@/components/habitos/WeekGrid'
import HabitForm from '@/components/habitos/HabitForm'

export default function HabitosPage() {
  const {
    completions,
    loadHabits,
    addHabit,
    archiveHabit,
    toggleCompletion,
    getActiveHabits,
    isCompletedToday,
    getStreak,
    isLoaded,
  } = useHabitStore()

  const [showForm, setShowForm] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  const todayId = getTodayId()
  const last7Days = getLastNDays(7)
  const activeHabits = getActiveHabits()
  const habitsToday = activeHabits.filter((h) => isHabitDueToday(h, todayId, completions))
  const completedTodayCount = habitsToday.filter((h) => isCompletedToday(h.id, todayId)).length

  const archivedHabits = isLoaded
    ? Object.values(useHabitStore.getState().habits).filter((h) => h.isArchived)
    : []

  const handleAddHabit = async (data: {
    title: string
    frequency: 'daily' | 'weekly'
    area?: AreaKey
    icon?: string
  }) => {
    await addHabit({ ...data })
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ae-text">💪 Hábitos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-ae-primordial px-4 py-2 text-sm font-semibold text-ae-bg transition-opacity hover:opacity-90"
        >
          Nuevo +
        </button>
      </div>

      {/* Empty state */}
      {isLoaded && activeHabits.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-ae-border bg-ae-surface p-8 text-center">
          <p className="mb-1 text-4xl">🌱</p>
          <p className="mt-3 text-base font-medium text-ae-text">
            Empezá con un hábito pequeño.
          </p>
          <p className="mt-1 text-sm text-ae-text-muted">
            La consistencia importa más que la perfección.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-ae-primordial px-5 py-2.5 font-semibold text-ae-bg transition-opacity hover:opacity-90"
          >
            Crear mi primer hábito
          </button>
        </div>
      )}

      {/* Today's habits */}
      {habitsToday.length > 0 && (
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-ae-text">Hoy</h2>
            <span className="rounded-full bg-ae-surface-2 px-2.5 py-0.5 text-xs font-medium text-ae-text-muted">
              {completedTodayCount}/{habitsToday.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {habitsToday.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                isCompleted={isCompletedToday(habit.id, todayId)}
                streak={getStreak(habit.id)}
                onToggle={() => toggleCompletion(habit.id, todayId)}
                onArchive={() => archiveHabit(habit.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Week overview */}
      {activeHabits.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 font-semibold text-ae-text">Últimos 7 días</h2>
          <div className="rounded-xl bg-ae-surface p-4">
            <WeekGrid
              habits={activeHabits}
              completions={completions}
              last7Days={last7Days}
            />
          </div>
        </section>
      )}

      {/* Archived habits */}
      {archivedHabits.length > 0 && (
        <section className="mb-6">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-ae-text-muted hover:text-ae-text"
          >
            <span>{showArchived ? '▾' : '▸'}</span>
            Archivados ({archivedHabits.length})
          </button>
          {showArchived && (
            <div className="mt-2 flex flex-col gap-2 opacity-60">
              {archivedHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 rounded-xl bg-ae-surface px-4 py-3"
                >
                  <span className="text-ae-text-muted line-through">
                    {habit.icon && <span className="mr-1">{habit.icon}</span>}
                    {habit.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* HabitForm modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center overflow-y-auto sm:py-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-ae-bg p-5 sm:rounded-2xl sm:p-6 sm:my-auto">
            <h2 className="mb-5 text-lg font-bold text-ae-text">Nuevo hábito</h2>
            <HabitForm onSave={handleAddHabit} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

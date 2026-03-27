'use client'

import { useEffect, useState } from 'react'
import { useHabitStore } from '@/store/habitStore'
import { getTodayId, getLastNDays } from '@/lib/dateUtils'
import { isHabitDueToday } from '@/lib/habitUtils'
import type { AreaKey } from '@/types/area'
import HabitItem from '@/components/habitos/HabitItem'
import WeekGrid from '@/components/habitos/WeekGrid'
import HabitForm from '@/components/habitos/HabitForm'

import type { Habit } from '@/types/habit'

export default function HabitosPage() {
  const {
    completions,
    loadHabits,
    addHabit,
    updateHabit,
    archiveHabit,
    deleteHabit,
    restoreHabit,
    toggleCompletion,
    getActiveHabits,
    isCompletedToday,
    getStreak,
    isLoaded,
  } = useHabitStore()

  const [showForm, setShowForm] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [editFrequency, setEditFrequency] = useState<'daily' | 'weekly'>('daily')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

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

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setEditTitle(habit.title)
    setEditIcon(habit.icon ?? '')
    setEditFrequency(habit.frequency)
  }

  const handleSaveEdit = async () => {
    if (!editingHabit) return
    await updateHabit(editingHabit.id, {
      title: editTitle.trim() || editingHabit.title,
      icon: editIcon.trim() || undefined,
      frequency: editFrequency,
    })
    setEditingHabit(null)
  }

  const handleDeleteHabit = (id: string) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteId) return
    await deleteHabit(confirmDeleteId)
    setConfirmDeleteId(null)
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
                onEdit={() => handleOpenEdit(habit)}
                onDelete={() => handleDeleteHabit(habit.id)}
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
            <div className="mt-2 flex flex-col gap-2">
              {archivedHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 rounded-xl bg-ae-surface px-4 py-3 opacity-70"
                >
                  <span className="flex-1 text-ae-text-muted line-through min-w-0 truncate">
                    {habit.icon && <span className="mr-1">{habit.icon}</span>}
                    {habit.title}
                  </span>
                  <button
                    onClick={() => restoreHabit(habit.id)}
                    className="flex-shrink-0 rounded-lg bg-ae-surface-2 px-2.5 py-1 text-xs font-medium text-ae-text-muted hover:text-ae-text transition-colors"
                  >
                    ↩ Restaurar
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="flex-shrink-0 rounded-lg bg-ae-danger/10 px-2.5 py-1 text-xs font-medium text-ae-danger hover:bg-ae-danger/20 transition-colors"
                  >
                    🗑 Borrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* HabitForm modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg bg-ae-surface rounded-2xl border border-ae-border shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-ae-text">Nuevo hábito</h2>
              <HabitForm onSave={handleAddHabit} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Edit habit modal */}
      {editingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditingHabit(null)}>
          <div className="w-full max-w-sm bg-ae-surface rounded-2xl border border-ae-border shadow-xl p-5 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-ae-text">Editar hábito</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ae-text-muted uppercase tracking-wider">Título</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-xl border border-ae-border bg-ae-surface-2 px-3 py-2 text-sm text-ae-text focus:outline-none focus:border-ae-primordial"
                placeholder="Nombre del hábito"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ae-text-muted uppercase tracking-wider">Ícono (emoji)</label>
              <input
                type="text"
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
                className="rounded-xl border border-ae-border bg-ae-surface-2 px-3 py-2 text-sm text-ae-text focus:outline-none focus:border-ae-primordial"
                placeholder="e.g. 💪"
                maxLength={4}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ae-text-muted uppercase tracking-wider">Frecuencia</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditFrequency('daily')}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${editFrequency === 'daily' ? 'bg-ae-success/20 text-ae-success border border-ae-success/40' : 'bg-ae-surface-2 text-ae-text-muted border border-transparent'}`}
                >
                  Diario
                </button>
                <button
                  onClick={() => setEditFrequency('weekly')}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${editFrequency === 'weekly' ? 'bg-ae-info/20 text-ae-info border border-ae-info/40' : 'bg-ae-surface-2 text-ae-text-muted border border-transparent'}`}
                >
                  Semanal
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-xl bg-ae-primordial px-4 py-2.5 text-sm font-semibold text-ae-bg transition-opacity hover:opacity-90"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingHabit(null)}
                className="flex-1 rounded-xl bg-ae-surface-2 px-4 py-2.5 text-sm font-medium text-ae-text-muted hover:text-ae-text transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-ae-surface rounded-2xl border border-ae-border shadow-xl p-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-ae-text">¿Borrar este hábito?</h2>
            <p className="text-sm text-ae-text-muted">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-ae-danger/20 px-4 py-2.5 text-sm font-semibold text-ae-danger hover:bg-ae-danger/30 transition-colors"
              >
                Sí, borrar
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-xl bg-ae-surface-2 px-4 py-2.5 text-sm font-medium text-ae-text-muted hover:text-ae-text transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

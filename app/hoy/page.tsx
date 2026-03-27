"use client"

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { canPromoteToPrimordial } from '@/lib/taskRules'
import { runMigrations } from '@/lib/migration'
import { getTodayId } from '@/lib/dateUtils'
import type { TaskPriority } from '@/types/task'
import { hapticSuccess, hapticLight } from '@/lib/haptics'
import { getUserName } from '@/lib/userSettings'
import { getRandomPhrase } from '@/lib/motivationalPhrases'

import DayProgress from '@/components/hoy/DayProgress'
import PriorityCard from '@/components/hoy/PriorityCard'
import SecondaryTaskItem from '@/components/hoy/SecondaryTaskItem'
import HabitRow from '@/components/hoy/HabitRow'
import QuickAddFab from '@/components/hoy/QuickAddFab'
import { Toast } from '@/components/shared/Toast'

export default function HoyPage() {
  const {
    tasks,
    loadToday,
    addTask,
    completeTask,
    uncompleteTask,
    deferTask,
    deleteTask,
    updateTask,
    isLoaded,
    todayId,
    getTodayStats,
  } = useTaskStore()

  const {
    loadHabits,
    toggleCompletion,
    getActiveHabits,
    isCompletedToday,
    getStreak,
    isLoaded: habitsLoaded,
  } = useHabitStore()

  const [migrationsRan, setMigrationsRan] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [deferToast, setDeferToast] = useState(false)
  const [deferringId, setDeferringId] = useState<string | null>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(false)
  const [completedCollapsed, setCompletedCollapsed] = useState(true)
  const [fabPriority, setFabPriority] = useState<TaskPriority>('puede_esperar')
  const [userName, setUserName] = useState<string | null>(null)
  const [phrase, setPhrase] = useState<string>('')

  useEffect(() => {
    setUserName(getUserName())
    setPhrase(getRandomPhrase())
  }, [])

  // Run migrations once on first load
  useEffect(() => {
    if (!migrationsRan) {
      runMigrations().then(() => setMigrationsRan(true))
    }
  }, [migrationsRan])

  // Load data
  useEffect(() => {
    loadToday()
    loadHabits()
  }, [loadToday, loadHabits])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(t)
    }
  }, [toast])

  // Derived task lists
  const currentTodayId = todayId || getTodayId()
  const todayTasks = Object.values(tasks).filter(
    (t) => t.dayId === currentTodayId && t.status !== 'deleted'
  )
  const primordialTasks = todayTasks.filter(
    (t) => t.priority === 'primordial' && t.status !== 'done'
  )
  const donePrimordial = todayTasks.filter(
    (t) => t.priority === 'primordial' && t.status === 'done'
  )
  const secondaryTasks = todayTasks
    .filter((t) => t.priority !== 'primordial' && t.status === 'pending')
    .sort((a, b) => {
      const order = { importante: 0, puede_esperar: 1 }
      return (order[a.priority as 'importante' | 'puede_esperar'] ?? 1) -
             (order[b.priority as 'importante' | 'puede_esperar'] ?? 1)
    })
  const completedTasks = todayTasks.filter((t) => t.status === 'done')

  // A1: use store selector for real-time counters
  const todayStats = getTodayStats()
  const completedCount = todayStats.done
  const totalCount = todayStats.total

  // Habits
  const activeHabits = habitsLoaded ? getActiveHabits() : []
  const completedHabits = activeHabits.filter((h) => isCompletedToday(h.id, currentTodayId)).length

  // Human-readable date header
  const dateLabel = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  // Capitalize first letter
  const dateDisplay = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)

  const handleAddTask = useCallback(
    async (title: string, priority: TaskPriority = 'puede_esperar') => {
      if (priority === 'primordial') {
        const check = canPromoteToPrimordial(primordialTasks.length)
        if (!check.allowed) {
          setToast(check.reason ?? 'No podés agregar más prioridades primordiales hoy.')
          return
        }
      }
      await addTask({ title, priority, dayId: currentTodayId })
    },
    [addTask, currentTodayId, primordialTasks.length]
  )

  const handlePromote = useCallback(
    async (id: string) => {
      const check = canPromoteToPrimordial(primordialTasks.length)
      if (!check.allowed) {
        setToast(check.reason ?? 'No podés agregar más prioridades primordiales hoy.')
        return
      }
      await updateTask(id, { priority: 'primordial' })
    },
    [updateTask, primordialTasks.length]
  )

  // A3: unified handler for opening the add task sheet
  const openAddSheet = useCallback((priority: TaskPriority = 'primordial') => {
    setFabPriority(priority)
    setShowAddSheet(true)
  }, [])

  // A2: defer with visual feedback
  const handleDefer = useCallback(
    async (id: string) => {
      setDeferringId(id)
      // Wait for animation
      setTimeout(async () => {
        await deferTask(id)
        setDeferringId(null)
        setDeferToast(true)
        setTimeout(() => setDeferToast(false), 2000)
      }, 300)
    },
    [deferTask]
  )

  const handleEditTask = useCallback(
    async (id: string, changes: { title?: string; priority?: TaskPriority }) => {
      await updateTask(id, changes)
    },
    [updateTask]
  )

  const handleDeleteTask = useCallback(
    async (id: string) => {
      await deleteTask(id)
    },
    [deleteTask]
  )

  const showSecondary = secondaryTasks.length > 0
  const visibleSecondary = secondaryCollapsed ? [] : secondaryTasks.slice(0, 10)
  const hasMore = secondaryTasks.length > 10

  // Loading skeleton
  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <div className="h-8 w-48 bg-ae-surface rounded-lg animate-pulse" />
        <div className="h-4 w-32 bg-ae-surface rounded animate-pulse" />
        <div className="h-2 w-full bg-ae-surface rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-ae-surface rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-8 pb-32">
      {/* Toast (general) */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-ae-surface border border-ae-border rounded-xl px-4 py-3 shadow-xl max-w-sm text-sm text-ae-text text-center">
          {toast}
        </div>
      )}

      {/* A2: Defer toast */}
      {deferToast && (
        <Toast message="Tarea diferida a mañana" onDone={() => setDeferToast(false)} duration={2000} />
      )}

      {/* 1. Header */}
      <header className="space-y-1">
        <h1 className="page-title text-ae-text">{dateDisplay}</h1>
        <p className="text-ae-text-muted text-sm">
          ¿Qué vas a lograr hoy{userName ? `, ${userName}` : ''}?
        </p>
        {phrase && (
          <p className="text-xs text-ae-text-muted/70 italic pt-0.5">{phrase}</p>
        )}
      </header>

      {/* 2. Day Progress */}
      <DayProgress
        completed={completedCount}
        total={totalCount}
        primordialDone={donePrimordial.length}
        primordialTotal={primordialTasks.length + donePrimordial.length}
      />

      {/* 3. Top 3 Prioridades */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ae-text flex items-center gap-2">
            Prioridades del día
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-ae-primordial/15 text-ae-primordial">
              {primordialTasks.length + donePrimordial.length}/3
            </span>
          </h2>
        </div>

        {primordialTasks.length === 0 && donePrimordial.length === 0 ? (
          /* A4: plain informational text + proper CTA button */
          <div className="bg-ae-surface rounded-xl p-6 border border-ae-border border-dashed text-center space-y-3">
            <p className="text-ae-text-muted text-sm">Sin prioridades aún. Elegí hasta 3 tareas primordiales para hoy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {primordialTasks.map((task, i) => (
              <PriorityCard
                key={task.id}
                task={task}
                index={i}
                onComplete={() => { hapticSuccess(); completeTask(task.id) }}
                onDefer={() => handleDefer(task.id)}
                onDelete={() => deleteTask(task.id)}
                className={deferringId === task.id ? 'opacity-0 translate-x-4 transition-all duration-300' : 'transition-all duration-300'}
              />
            ))}
            {/* Completed primordials (faded) */}
            {donePrimordial.map((task, i) => (
              <PriorityCard
                key={task.id}
                task={task}
                index={primordialTasks.length + i}
                onComplete={() => completeTask(task.id)}
                onDefer={() => handleDefer(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        )}

        {/* A3: Add primordial CTA if < 3 — calls unified openAddSheet */}
        {primordialTasks.length + donePrimordial.length < 3 && (
          <button
            onClick={() => openAddSheet('primordial')}
            className="w-full text-sm text-ae-primordial/70 hover:text-ae-primordial border border-dashed border-ae-primordial/30 hover:border-ae-primordial/60 rounded-xl py-3 transition-colors"
          >
            + {primordialTasks.length + donePrimordial.length === 0 ? 'Agregar primera prioridad' : 'Agregar prioridad'}
          </button>
        )}
      </section>

      {/* 4. Hábitos del día */}
      {activeHabits.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ae-text flex items-center gap-2">
              Hábitos
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-ae-surface-2 text-ae-text-muted">
                {completedHabits}/{activeHabits.length}
              </span>
            </h2>
            <Link href="/habitos" className="text-xs text-ae-text-muted hover:text-ae-text transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="pt-1">
            <HabitRow
              habits={activeHabits}
              todayId={currentTodayId}
              isCompleted={isCompletedToday}
              onToggle={(habitId) => { hapticLight(); toggleCompletion(habitId, currentTodayId) }}
              getStreak={getStreak}
            />
          </div>
        </section>
      )}

      {/* 5. Tareas secundarias */}
      {showSecondary && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSecondaryCollapsed((v) => !v)}
              className="font-semibold text-ae-text flex items-center gap-2 hover:text-ae-text/80 transition-colors"
            >
              Otras tareas
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-ae-surface-2 text-ae-text-muted">
                {secondaryTasks.length}
              </span>
              <span className="text-xs text-ae-text-muted">{secondaryCollapsed ? '▸' : '▾'}</span>
            </button>
          </div>

          {!secondaryCollapsed && (
            <div className="space-y-1.5">
              {visibleSecondary.map((task) => (
                <SecondaryTaskItem
                  key={task.id}
                  task={task}
                  onComplete={() => completeTask(task.id)}
                  onDefer={() => handleDefer(task.id)}
                  onPromote={() => handlePromote(task.id)}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {hasMore && (
                <Link
                  href="/inbox"
                  className="block text-center text-sm text-ae-text-muted hover:text-ae-text py-2 transition-colors"
                >
                  Ver todas las tareas →
                </Link>
              )}
            </div>
          )}
        </section>
      )}

      {/* 6. Completadas hoy */}
      {completedTasks.length > 0 && (
        <section className="space-y-3">
          <div className="border-t border-ae-border pt-4">
            <button
              onClick={() => setCompletedCollapsed((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-ae-text-muted hover:text-ae-text transition-colors w-full"
            >
              <span>{completedCollapsed ? '▸' : '▾'}</span>
              <span>Completadas hoy</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-ae-success/15 text-ae-success text-xs font-semibold">
                {completedTasks.length}
              </span>
            </button>
          </div>

          {!completedCollapsed && (
            <div className="space-y-1.5">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-ae-surface px-4 py-3 opacity-60"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-ae-text line-through">
                      {task.title}
                    </span>
                    {task.completedAt && (
                      <span className="text-xs text-ae-text-muted">
                        {new Date(task.completedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => uncompleteTask(task.id)}
                    className="shrink-0 rounded-lg bg-ae-surface-2 px-3 py-1.5 text-xs font-medium text-ae-text-muted hover:text-ae-text hover:bg-ae-border transition-colors"
                  >
                    Desmarcar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Empty state if truly nothing */}
      {totalCount === 0 && (
        <div className="text-center py-12 space-y-3">
          <p className="text-4xl">🌅</p>
          <p className="text-ae-text font-medium">Día en blanco</p>
          <p className="text-ae-text-muted text-sm">Agregá tus primeras tareas del día</p>
        </div>
      )}

      {/* C3: Daily review CTA — show if all primordials done OR hour >= 18 */}
      {((donePrimordial.length === primordialTasks.length + donePrimordial.length && primordialTasks.length + donePrimordial.length > 0) || new Date().getHours() >= 18) ? (
        <div className="mx-4 mb-6 p-4 rounded-xl border border-ae-surface bg-ae-surface/50 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ae-text">¿Terminaste el día?</p>
            <p className="text-xs text-ae-muted">Hacé tu revisión diaria</p>
          </div>
          <a href="/revision" className="px-3 py-1.5 rounded-lg bg-ae-primordial/20 text-ae-primordial text-sm font-medium">
            Revisar →
          </a>
        </div>
      ) : null}

      {/* 6. QuickAddFab */}
      <QuickAddFab
        onAdd={handleAddTask}
        defaultPriority={fabPriority}
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
      />
    </div>
  )
}

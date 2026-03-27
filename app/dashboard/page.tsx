"use client"

import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWeeklyStore } from '@/store/weeklyStore'
import { getLastNDays, getDayLabel } from '@/lib/dateUtils'
import { AREAS } from '@/types/area'

export default function DashboardPage() {
  const { tasks, loadToday, todayId } = useTaskStore()
  const { loadHabits, getActiveHabits, isCompletedToday } = useHabitStore()
  const { streak, loadDashboard } = useDashboardStore()
  const { currentWeek, loadWeek } = useWeeklyStore()

  useEffect(() => {
    loadToday()
    loadHabits()
    loadDashboard()
    loadWeek()
  }, [])

  const allTodayTasks = Object.values(tasks).filter(t => t.dayId === todayId && t.status !== 'deleted')
  const doneTasks = allTodayTasks.filter(t => t.status === 'done')
  const primordialTasks = allTodayTasks.filter(t => t.priority === 'primordial')
  const primordialDone = primordialTasks.filter(t => t.status === 'done')

  const total = allTodayTasks.length
  const done = doneTasks.length
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0

  const activeHabits = getActiveHabits()
  const last7Days = getLastNDays(7)

  // Area distribution
  const areaCounts: Record<string, number> = {}
  for (const task of allTodayTasks) {
    if (task.area) {
      areaCounts[task.area] = (areaCounts[task.area] ?? 0) + 1
    }
  }
  const areasWithTasks = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])

  // Habit consistency rate for last 7 days
  const totalSlots = activeHabits.length * 7
  const completedSlots = activeHabits.reduce((acc, habit) => {
    return acc + last7Days.filter(d => isCompletedToday(habit.id, d)).length
  }, 0)
  const consistencyRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0

  const now = new Date()
  const dateLabel = now.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="page-title text-ae-text">Dashboard</h1>
        <p className="text-ae-text-muted text-sm capitalize">{dateLabel}</p>
      </div>

      {/* Today summary */}
      <div className="bg-ae-surface rounded-xl p-4">
        <h2 className="text-ae-text font-semibold mb-3">Hoy</h2>
        <div className="flex items-center gap-4">
          {/* Circle progress */}
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-ae-border" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPct / 100)}`}
                className="text-ae-primordial transition-all"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ae-text">
              {progressPct}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ae-primordial" />
              <span className="text-ae-text text-sm">
                Tareas: <span className="font-semibold">{done}/{total}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ae-accent" />
              <span className="text-ae-text text-sm">
                Primordiales: <span className="font-semibold">{primordialDone.length}/{primordialTasks.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak card */}
      <div className="bg-ae-surface rounded-xl p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-ae-primordial">
            🔥 {streak?.currentCount ?? 0}
          </span>
          <span className="text-ae-text font-semibold">días de racha</span>
        </div>
        <p className="text-ae-text-muted text-sm mt-1">
          Mejor racha: {streak?.longestCount ?? 0} días
        </p>
      </div>

      {/* Habits this week */}
      {activeHabits.length > 0 && (
        <div className="bg-ae-surface rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-ae-text font-semibold">Hábitos (7 días)</h2>
            <span className="text-ae-text-muted text-sm">{consistencyRate}% consistencia</span>
          </div>
          <div className="space-y-3">
            {activeHabits.map(habit => (
              <div key={habit.id} className="flex items-center justify-between">
                <span className="text-ae-text text-sm truncate max-w-[120px]">{habit.title}</span>
                <div className="flex gap-1">
                  {last7Days.map(day => (
                    <div
                      key={day}
                      title={getDayLabel(day)}
                      className={`w-5 h-5 rounded-full ${
                        isCompletedToday(habit.id, day)
                          ? 'bg-ae-success'
                          : 'bg-ae-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Area distribution */}
      {areasWithTasks.length > 0 && (
        <div className="bg-ae-surface rounded-xl p-4">
          <h2 className="text-ae-text font-semibold mb-3">Distribución por área</h2>
          <div className="space-y-2">
            {areasWithTasks.map(([areaKey, count]) => {
              const area = AREAS[areaKey as keyof typeof AREAS]
              if (!area) return null
              return (
                <div key={areaKey} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: area.color }}
                  />
                  <span className="text-ae-text text-sm flex-1">{area.icon} {area.name}</span>
                  <span className="text-ae-text-muted text-sm">{count} tarea{count !== 1 ? 's' : ''}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Weekly goals */}
      {currentWeek && currentWeek.primordialGoals.length > 0 && (
        <div className="bg-ae-surface rounded-xl p-4">
          <h2 className="text-ae-text font-semibold mb-3">Metas semanales</h2>
          <div className="space-y-2">
            {currentWeek.primordialGoals.map((goal, i) => {
              const text = typeof goal === 'string' ? goal : goal.text
              const done = typeof goal === 'string' ? false : goal.done
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-ae-text-muted mt-0.5">{done ? '●' : '○'}</span>
                  <span className={`text-sm ${done ? 'line-through text-ae-text-muted' : 'text-ae-text'}`}>{text}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

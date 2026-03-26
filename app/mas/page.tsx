"use client"

import { useRouter } from 'next/navigation'
import { useTaskStore } from '@/store/taskStore'
import { useHabitStore } from '@/store/habitStore'
import { getTodayId } from '@/lib/dateUtils'

const NAV_CARDS = [
  { icon: '📂', title: 'Proyectos', href: '/proyectos' },
  { icon: '💪', title: 'Hábitos', href: '/habitos' },
  { icon: '🔄', title: 'Revisión', href: '/revision' },
  { icon: '📊', title: 'Dashboard', href: '/dashboard' },
]

export default function MasPage() {
  const router = useRouter()
  const { tasks } = useTaskStore()
  const { getActiveHabits, isCompletedToday } = useHabitStore()

  // X4: Calculate week done tasks
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const weekDoneTasks = Object.values(tasks).filter((t) => {
    if (t.status !== 'done' || !t.completedAt) return false
    return new Date(t.completedAt) >= startOfWeek
  }).length

  // X4: Today's habits
  const todayId = getTodayId()
  const activeHabits = getActiveHabits()
  const totalHabits = activeHabits.length
  const todayHabitsDone = activeHabits.filter((h) => isCompletedToday(h.id, todayId)).length

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-ae-text mb-6">Más</h1>

      {/* X4: Mini stats widget */}
      <div className="flex gap-3 px-0 mb-6">
        <div className="flex-1 bg-ae-surface rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-ae-primordial">{weekDoneTasks}</p>
          <p className="text-xs text-ae-muted">tareas esta semana</p>
        </div>
        <div className="flex-1 bg-ae-surface rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-ae-primordial">{todayHabitsDone}/{totalHabits}</p>
          <p className="text-xs text-ae-muted">hábitos hoy</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {NAV_CARDS.map(card => (
          <button
            key={card.href}
            onClick={() => router.push(card.href)}
            className="bg-ae-surface rounded-xl p-6 flex flex-col items-center gap-3 active:scale-95 transition-transform text-left"
          >
            <span className="text-4xl">{card.icon}</span>
            <span className="text-ae-text font-semibold text-sm">{card.title}</span>
          </button>
        ))}
      </div>

      {/* C4: Ajustes — non-navigable, Próximamente */}
      <div className="border-t border-ae-border pt-6">
        <div className="flex items-center gap-3 py-2 opacity-50 cursor-not-allowed">
          <span className="text-xl">⚙️</span>
          <span className="text-sm text-ae-text-muted">Ajustes</span>
          <span className="ml-auto text-xs bg-ae-surface text-ae-muted px-2 py-0.5 rounded-full">Próximamente</span>
        </div>
      </div>
    </div>
  )
}

"use client"

import type { Task } from '@/types/task'

interface DayColumnProps {
  dayId: string
  tasks: Task[]
  isToday: boolean
  onClick: () => void
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function DayColumn({ dayId, tasks, isToday, onClick }: DayColumnProps) {
  const date = new Date(dayId + 'T00:00:00')
  const dayName = DAY_NAMES[date.getDay()]
  const dayNum = date.getDate()

  const activeTasks = tasks.filter((t) => t.status !== 'deleted' && t.status !== 'deferred')
  const completedTasks = activeTasks.filter((t) => t.status === 'done')
  const primordialTasks = activeTasks.filter((t) => t.priority === 'primordial')
  const completedPrimordials = primordialTasks.filter((t) => t.status === 'done')

  let indicatorColor = 'bg-ae-secondary/40'
  let indicatorTitle = 'Sin tareas'
  if (activeTasks.length > 0) {
    if (primordialTasks.length > 0 && completedPrimordials.length < primordialTasks.length) {
      indicatorColor = 'bg-ae-primordial'
      indicatorTitle = 'Primordiales pendientes'
    } else if (activeTasks.length > 0 && completedTasks.length === activeTasks.length) {
      indicatorColor = 'bg-ae-success'
      indicatorTitle = 'Todo completado'
    } else {
      indicatorColor = 'bg-ae-success'
      indicatorTitle = 'Primordiales completas'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all min-w-[64px] cursor-pointer
        ${isToday
          ? 'bg-ae-surface border-ae-primordial ring-1 ring-ae-primordial/50'
          : 'bg-ae-surface border-ae-border hover:border-ae-secondary/60 hover:bg-ae-surface-2'
        }`}
      title={indicatorTitle}
    >
      <span className={`text-xs font-medium ${isToday ? 'text-ae-primordial' : 'text-ae-text-muted'}`}>
        {dayName}
      </span>
      <span className={`text-lg font-bold ${isToday ? 'text-ae-primordial' : 'text-ae-text'}`}>
        {dayNum}
      </span>

      {/* Color indicator dot */}
      <div className={`w-2 h-2 rounded-full ${indicatorColor}`} />

      {/* Task count badge */}
      {activeTasks.length > 0 && (
        <span className="text-xs text-ae-text-muted font-mono">
          {completedTasks.length}/{activeTasks.length}
        </span>
      )}
    </button>
  )
}

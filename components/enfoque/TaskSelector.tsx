"use client"

import Link from 'next/link'
import type { Task } from '@/types/task'

interface TaskSelectorProps {
  tasks: Task[]
  selectedTaskId: string | null
  onSelect: (taskId: string) => void
}

export function TaskSelector({ tasks, selectedTaskId, onSelect }: TaskSelectorProps) {
  const activeTasks = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred'
  )

  // Primordial tasks first
  const sorted = [...activeTasks].sort((a, b) => {
    const aPrim = a.priority === 'primordial' ? 0 : 1
    const bPrim = b.priority === 'primordial' ? 0 : 1
    return aPrim - bPrim
  })

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-ae-border bg-ae-surface p-4 text-center">
        <p className="text-sm text-ae-text-muted">No hay tareas para hoy.</p>
        <Link
          href="/hoy"
          className="mt-2 inline-block text-sm text-amber-400 hover:text-amber-300"
        >
          Agregá una desde Hoy →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-ae-border bg-ae-surface p-2">
      {sorted.map((task) => {
        const isPrimordial = task.priority === 'primordial'
        const isSelected = task.id === selectedTaskId
        return (
          <button
            key={task.id}
            onClick={() => onSelect(task.id)}
            className={[
              'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors',
              isSelected
                ? 'bg-ae-surface-2 ring-1 ring-amber-500/50'
                : 'hover:bg-ae-surface-2',
            ].join(' ')}
          >
            {/* Priority dot */}
            <span
              className={[
                'mt-0.5 h-2 w-2 flex-shrink-0 rounded-full',
                isPrimordial ? 'bg-amber-400' : 'bg-ae-text-muted',
              ].join(' ')}
            />
            <span
              className={[
                'truncate text-sm',
                isSelected ? 'font-medium text-ae-text' : 'text-ae-text-muted',
              ].join(' ')}
            >
              {task.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}

"use client"

import { useState } from 'react'
import type { Task } from '@/types/task'

interface TaskSelectorProps {
  tasks: Task[]
  selectedTaskId: string | null
  onSelect: (id: string | null) => void
  disabled?: boolean
}

export function TaskSelector({ tasks, selectedTaskId, onSelect, disabled }: TaskSelectorProps) {
  const [open, setOpen] = useState(false)

  const activeTasks = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred'
  )

  // Primordial tasks first
  const sorted = [...activeTasks].sort((a, b) => {
    const order = { primordial: 0, importante: 1, puede_esperar: 2 }
    return (order[a.priority as keyof typeof order] ?? 2) - (order[b.priority as keyof typeof order] ?? 2)
  })

  const selectedTask = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) : null

  const handleSelect = (id: string | null) => {
    onSelect(id)
    setOpen(false)
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => { if (!disabled) setOpen((v) => !v) }}
        disabled={disabled}
        className={[
          'w-full flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
          disabled
            ? 'border-ae-border bg-ae-surface opacity-60 cursor-not-allowed'
            : open
            ? 'border-amber-500/50 bg-ae-surface'
            : 'border-ae-border bg-ae-surface hover:border-ae-text-muted',
        ].join(' ')}
      >
        {/* Status dot */}
        <span
          className={[
            'flex-shrink-0 w-2 h-2 rounded-full',
            selectedTask
              ? selectedTask.priority === 'primordial' ? 'bg-amber-400' : 'bg-blue-400'
              : 'bg-green-400',
          ].join(' ')}
        />
        <span className="flex-1 truncate text-sm text-ae-text">
          {selectedTask ? selectedTask.title : '⚡ Sesión libre'}
        </span>
        <span className="flex-shrink-0 text-xs text-ae-text-muted">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-ae-border bg-ae-surface shadow-xl overflow-hidden">
          {/* Free session option */}
          <button
            onClick={() => handleSelect(null)}
            className={[
              'w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-ae-surface-2',
              !selectedTaskId ? 'bg-ae-surface-2' : '',
            ].join(' ')}
          >
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-ae-text">⚡ Sesión libre</span>
          </button>

          {/* Task list */}
          {sorted.map((task) => {
            const isSelected = task.id === selectedTaskId
            return (
              <button
                key={task.id}
                onClick={() => handleSelect(task.id)}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-ae-surface-2',
                  isSelected ? 'bg-ae-surface-2' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex-shrink-0 w-2 h-2 rounded-full',
                    task.priority === 'primordial' ? 'bg-amber-400' : 'bg-ae-text-muted',
                  ].join(' ')}
                />
                <span className={['truncate text-sm', isSelected ? 'font-medium text-ae-text' : 'text-ae-text-muted'].join(' ')}>
                  {task.title}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

"use client"

import { AREAS } from '@/types/area'
import type { Task } from '@/types/task'

interface SecondaryTaskItemProps {
  task: Task
  onComplete: () => void
  onDefer: () => void
  onPromote: () => void
}

export default function SecondaryTaskItem({ task, onComplete, onDefer, onPromote }: SecondaryTaskItemProps) {
  const isDone = task.status === 'done'
  const area = task.area ? AREAS[task.area] : null

  return (
    <div className="group flex items-center gap-3 bg-ae-surface-2 rounded-lg px-3 py-2 border border-transparent hover:border-ae-border transition-all duration-150">
      {/* Checkbox */}
      <button
        onClick={onComplete}
        disabled={isDone}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          isDone
            ? 'bg-ae-success border-ae-success text-white'
            : 'border-ae-border hover:border-ae-primordial'
        }`}
        title="Completar"
      >
        {isDone && <span className="text-xs">✓</span>}
      </button>

      {/* Priority dot */}
      <span
        className={`flex-shrink-0 w-2 h-2 rounded-full ${
          task.priority === 'primordial'
            ? 'bg-amber-400'
            : task.priority === 'importante'
            ? 'bg-blue-400'
            : task.priority === 'secundaria'
            ? 'bg-purple-400'
            : 'bg-ae-text-muted'
        }`}
      />

      {/* Title + date */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className={`text-sm truncate ${
            isDone ? 'line-through text-ae-text-muted' : 'text-ae-text'
          }`}
        >
          {task.title}
        </span>
        {task.scheduledDate && (
          <span className="text-xs text-ae-text-muted">
            {new Date(task.scheduledDate + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* Area badge */}
      {area && (
        <span
          className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: area.color + '22', color: area.color }}
        >
          {area.icon}
        </span>
      )}

      {/* Action buttons — visible on hover/focus */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={onPromote}
          className="p-1 rounded text-ae-primordial hover:bg-ae-primordial/10 transition-colors active:scale-95 text-xs font-bold"
          title="Promover a primordial"
        >
          ↑
        </button>
        <button
          onClick={onDefer}
          className="p-1 rounded text-ae-text-muted hover:bg-ae-surface transition-colors active:scale-95 text-xs"
          title="Diferir para mañana"
        >
          →
        </button>
      </div>
    </div>
  )
}

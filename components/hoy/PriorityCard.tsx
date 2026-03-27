"use client"

import { AREAS } from '@/types/area'
import type { Task } from '@/types/task'

interface PriorityCardProps {
  task: Task
  onComplete: () => void
  onDefer: () => void
  onDelete: () => void
  index: number
  className?: string
}

export default function PriorityCard({ task, onComplete, onDefer, onDelete, index, className }: PriorityCardProps) {
  const isDone = task.status === 'done'
  const area = task.area ? AREAS[task.area] : null
  const subtaskCount = task.subtaskIds?.length ?? 0
  // We don't have completed subtask data here, so just show total
  // In a fuller implementation you'd pass completed subtask count
  const completedSubtasks = 0

  return (
    <div
      className={`card-m3 p-4 transition-all duration-150 ${
        isDone ? 'opacity-50' : 'opacity-100'
      } ${className ?? ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Priority number indicator */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ae-primordial flex items-center justify-center">
          <span className="text-sm font-bold text-black">{index + 1}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h3
              className={`font-semibold text-ae-text leading-tight ${
                isDone ? 'line-through text-ae-text-muted' : ''
              }`}
            >
              {task.title}
            </h3>
            {isDone && (
              <span className="text-ae-success text-sm font-medium">✓</span>
            )}
          </div>

          {/* Area badge */}
          {area && (
            <span
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: area.color + '22', color: area.color }}
            >
              <span>{area.icon}</span>
              <span>{area.name}</span>
            </span>
          )}

          {/* Subtask progress */}
          {subtaskCount > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-ae-text-muted">
                  {completedSubtasks}/{subtaskCount} subtareas
                </span>
              </div>
              <div className="w-full h-1 bg-ae-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ae-primordial rounded-full transition-all"
                  style={{ width: `${subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-white/[0.06]">
        <button
          onClick={onComplete}
          disabled={isDone}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium text-ae-success border border-ae-success/30 hover:bg-ae-success/10 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Completar"
        >
          ✓ Completar
        </button>
        <button
          onClick={onDefer}
          disabled={isDone}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium text-ae-text-muted border border-ae-border hover:bg-ae-surface-2 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Diferir para mañana"
        >
          → Diferir
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded text-ae-danger/60 hover:text-ae-danger hover:bg-ae-danger/10 transition-colors"
          title="Eliminar"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

"use client"

import type { Task } from "@/types/task"

interface ActiveTaskProps {
  task: Task
  onComplete: () => void
  onSkip?: () => void
}

export default function ActiveTask({ task, onComplete, onSkip }: ActiveTaskProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-2">
      {/* Golden task badge */}
      {task.isGoldenTask && (
        <div className="flex items-center gap-2 bg-ae-signal/10 border border-ae-signal/30 rounded-full px-4 py-1">
          <span>⭐</span>
          <span className="text-ae-signal text-xs font-semibold tracking-wide uppercase">
            La Única Cosa
          </span>
        </div>
      )}

      {/* Task zone badge (shown if not signal, just in case) */}
      {task.zone !== "signal" && (
        <span className="text-ae-noise text-xs border border-ae-border rounded px-2 py-0.5">
          {task.zone}
        </span>
      )}

      {/* Task title */}
      <h2 className="text-3xl font-bold text-ae-text leading-tight max-w-md">
        {task.title}
      </h2>

      {/* Description */}
      {task.description && (
        <p className="text-ae-text-muted text-sm max-w-sm">{task.description}</p>
      )}

      {/* Complete button */}
      <button
        onClick={onComplete}
        className="mt-2 bg-ae-success/90 hover:bg-ae-success text-ae-bg font-bold text-base px-8 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-ae-success/20"
      >
        Marcar como completada ✓
      </button>

      {/* Skip link */}
      {onSkip && (
        <button
          onClick={onSkip}
          className="text-ae-text-muted text-sm hover:text-ae-text transition-colors"
        >
          Omitir por ahora →
        </button>
      )}
    </div>
  )
}

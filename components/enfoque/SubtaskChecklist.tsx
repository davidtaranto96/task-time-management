"use client"

import { useState } from 'react'

interface SubtaskChecklistProps {
  subtaskIds: string[]
  onToggle: (subtaskId: string) => void
}

// Minimal local state for MVP — subtasks loaded from IDB would be passed in;
// for now we track completion state locally by ID.
export function SubtaskChecklist({ subtaskIds, onToggle }: SubtaskChecklistProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  if (subtaskIds.length === 0) {
    return (
      <p className="text-center text-xs text-ae-text-muted">Sin subtareas</p>
    )
  }

  function handleToggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    onToggle(id)
  }

  return (
    <div className="flex flex-col gap-1">
      {subtaskIds.map((id) => {
        const isDone = completed.has(id)
        return (
          <button
            key={id}
            onClick={() => handleToggle(id)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ae-surface-2"
          >
            <span
              className={[
                'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors',
                isDone
                  ? 'border-green-500 bg-green-500/20 text-green-400'
                  : 'border-ae-border text-transparent',
              ].join(' ')}
            >
              {isDone && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
            </span>
            <span
              className={[
                'text-sm',
                isDone
                  ? 'text-ae-text-muted line-through'
                  : 'text-ae-text',
              ].join(' ')}
            >
              {id}
            </span>
          </button>
        )
      })}
    </div>
  )
}

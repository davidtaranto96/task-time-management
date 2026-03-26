"use client"

import { useState, useRef, useCallback } from 'react'

interface Goal {
  text: string
  done: boolean
}

interface WeekGoalsProps {
  goals: Goal[]
  onChange: (goals: Goal[]) => void
}

export default function WeekGoals({ goals, onChange }: WeekGoalsProps) {
  const [newGoalText, setNewGoalText] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSave = useCallback(
    (updated: Goal[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onChange(updated)
      }, 500)
    },
    [onChange]
  )

  const handleAdd = () => {
    const text = newGoalText.trim()
    if (!text) return
    const updated = [...goals, { text, done: false }]
    onChange(updated)
    setNewGoalText('')
  }

  const handleToggle = (index: number) => {
    const updated = goals.map((g, i) => (i === index ? { ...g, done: !g.done } : g))
    onChange(updated)
  }

  const handleTextChange = (index: number, text: string) => {
    const updated = goals.map((g, i) => (i === index ? { ...g, text } : g))
    debouncedSave(updated)
  }

  const handleTextBlur = (index: number, text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const updated = goals.map((g, i) => (i === index ? { ...g, text } : g))
    onChange(updated)
  }

  const handleDelete = (index: number) => {
    const updated = goals.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="bg-ae-surface rounded-xl border border-ae-border p-4 mb-5">
      <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3">
        Lo primordial de la semana
      </h2>

      {goals.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {goals.map((goal, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(i)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  goal.done
                    ? 'bg-ae-success border-ae-success text-black'
                    : 'border-ae-primordial hover:border-ae-success'
                }`}
              >
                {goal.done && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Text input */}
              <input
                type="text"
                defaultValue={goal.text}
                onChange={(e) => handleTextChange(i, e.target.value)}
                onBlur={(e) => handleTextBlur(i, e.target.value)}
                className={`flex-1 bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-sm text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial transition-colors ${
                  goal.done ? 'line-through opacity-50' : ''
                }`}
              />

              {/* Delete button */}
              <button
                onClick={() => handleDelete(i)}
                className="flex-shrink-0 p-1 rounded text-ae-text-muted hover:text-ae-danger hover:bg-ae-danger/10 transition-colors"
                title="Eliminar meta"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 && (
        <p className="text-sm text-ae-text-muted mb-3">No hay metas definidas aún.</p>
      )}

      {/* Add goal */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="+ Agregar meta semanal"
          className="flex-1 bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-sm text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newGoalText.trim()}
          className="px-3 py-2 rounded-lg bg-ae-primordial text-black text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ae-primordial/90 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

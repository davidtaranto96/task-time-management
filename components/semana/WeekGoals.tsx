"use client"

import { useRef, useCallback } from 'react'

interface WeekGoalsProps {
  goals: string[]
  onChange: (goals: string[]) => void
}

export default function WeekGoals({ goals, onChange }: WeekGoalsProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (index: number, value: string) => {
      const updated = [...goals]
      while (updated.length < 3) updated.push('')
      updated[index] = value

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onChange(updated)
      }, 500)
    },
    [goals, onChange]
  )

  const handleBlur = useCallback(
    (index: number, value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      const updated = [...goals]
      while (updated.length < 3) updated.push('')
      updated[index] = value
      onChange(updated)
    },
    [goals, onChange]
  )

  const filledGoals = Array.from({ length: 3 }, (_, i) => goals[i] ?? '')

  return (
    <div className="bg-ae-surface rounded-xl border border-ae-border p-4 mb-5">
      <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3">
        Lo primordial de la semana
      </h2>
      <div className="flex flex-col gap-2">
        {filledGoals.map((goal, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ae-primordial flex items-center justify-center text-xs font-bold text-black">
              {i + 1}
            </span>
            <input
              type="text"
              defaultValue={goal}
              placeholder={`Meta semanal #${i + 1}...`}
              onChange={(e) => handleChange(i, e.target.value)}
              onBlur={(e) => handleBlur(i, e.target.value)}
              className="flex-1 bg-ae-surface-2 border-l-2 border-l-ae-primordial border border-ae-border rounded-lg px-3 py-2 text-sm text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

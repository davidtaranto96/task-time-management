"use client"

import { getCurrentWeekId, formatWeekRange } from '@/lib/weekUtils'

interface WeekHeaderProps {
  weekId: string
  onPrevWeek: () => void
  onNextWeek: () => void
}

export default function WeekHeader({ weekId, onPrevWeek, onNextWeek }: WeekHeaderProps) {
  const parts = weekId.split('-')
  const weekNum = parseInt(parts[2])
  const isCurrentWeek = weekId === getCurrentWeekId()
  const dateRange = formatWeekRange(weekId)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevWeek}
          className="p-2 rounded-lg text-ae-text-muted hover:text-ae-text hover:bg-ae-surface-2 transition-colors"
          aria-label="Semana anterior"
        >
          ←
        </button>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="page-title text-ae-text">Semana {weekNum}</h1>
            {isCurrentWeek && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-ae-primordial/20 text-ae-primordial border border-ae-primordial/30">
                Esta semana
              </span>
            )}
          </div>
          <p className="text-sm text-ae-text-muted">{dateRange}</p>
        </div>

        <button
          onClick={onNextWeek}
          className="p-2 rounded-lg text-ae-text-muted hover:text-ae-text hover:bg-ae-surface-2 transition-colors"
          aria-label="Semana siguiente"
        >
          →
        </button>
      </div>
    </div>
  )
}

"use client"

interface DayProgressProps {
  completed: number
  total: number
  primordialDone: number
  primordialTotal: number
}

export default function DayProgress({ completed, total, primordialDone, primordialTotal }: DayProgressProps) {
  const allPrimordialDone = primordialTotal > 0 && primordialDone >= primordialTotal
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ae-text-muted">
          {completed} de {total} completadas
        </span>
        {allPrimordialDone && (
          <span className="text-sm text-ae-success font-medium flex items-center gap-1">
            ✨ Prioridades del día completadas
          </span>
        )}
        {!allPrimordialDone && total > 0 && (
          <span className="text-xs text-ae-text-muted">{percent}%</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-ae-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-ae-primordial rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

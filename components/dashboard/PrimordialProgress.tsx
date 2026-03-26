"use client"

interface PrimordialProgressProps {
  done: number
  total: number
  isSuccessful: boolean
}

export default function PrimordialProgress({ done, total, isSuccessful }: PrimordialProgressProps) {
  const size = 200
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? done / total : 0
  const dashOffset = circumference * (1 - progress)

  const strokeColor = isSuccessful ? "#10b981" : "#f59e0b"
  const glowFilter = isSuccessful
    ? "drop-shadow(0 0 10px #10b98177)"
    : undefined

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center rounded-full border-2 border-ae-border bg-ae-surface-2"
          style={{ width: size, height: size }}
        >
          <span className="text-ae-text-muted text-sm text-center px-4">
            Sin tareas primordiales
          </span>
        </div>
        <span className="text-ae-text-muted text-xs">Tareas Clave</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2a2a35"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.5s ease",
              filter: glowFilter,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className="font-bold tabular-nums"
            style={{
              fontSize: "2.25rem",
              lineHeight: 1,
              color: isSuccessful ? "#10b981" : "#f4f4f5",
            }}
          >
            {done}/{total}
          </span>
          <span className="text-ae-text-muted text-xs text-center">Tareas Clave</span>
        </div>
      </div>

      {isSuccessful && (
        <span
          className="text-ae-success text-xs font-bold tracking-widest uppercase"
          style={{ textShadow: "0 0 8px #10b98177" }}
        >
          DÍA EXITOSO
        </span>
      )}
    </div>
  )
}

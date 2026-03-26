"use client"

import { useEffect, useRef } from "react"
import type { TimerMode, TimerStatus } from "@/types/timer"

interface PomodoroTimerProps {
  remainingSeconds: number
  totalSeconds: number
  status: TimerStatus
  mode: TimerMode
  onTick?: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function getModeLabel(mode: TimerMode): string {
  switch (mode) {
    case "pomodoro_50": return "Deep Work 50min"
    case "pomodoro_25": return "Deep Work 25min"
    case "musk_5": return "Modo Musk 5min"
    case "break_5": return "Descanso"
    case "break_10": return "Descanso"
  }
}

export default function PomodoroTimer({
  remainingSeconds,
  totalSeconds,
  status,
  mode,
  onTick,
}: PomodoroTimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (status === "running" && onTick) {
      intervalRef.current = setInterval(() => {
        onTick()
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [status, onTick])

  const size = 280
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0
  const dashOffset = circumference * (1 - progress)

  const isCompleted = status === "completed"
  const isPaused = status === "paused"
  const isRunning = status === "running"

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
          {!isCompleted && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isCompleted ? "#10b981" : "#f59e0b"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transition: "stroke-dashoffset 0.5s ease",
                filter: isRunning ? "drop-shadow(0 0 8px #f59e0b99)" : undefined,
              }}
            />
          )}
          {/* Completed: full green circle */}
          {isCompleted && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              style={{ filter: "drop-shadow(0 0 8px #10b98177)" }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {isCompleted ? (
            <>
              <span className="text-ae-success text-4xl font-bold">✓</span>
              <span className="text-ae-success text-sm font-medium">Completado</span>
            </>
          ) : (
            <>
              <span
                className={`text-ae-text font-bold tabular-nums ${isPaused ? "animate-pulse" : ""}`}
                style={{ fontSize: "3rem", lineHeight: 1 }}
              >
                {formatTime(remainingSeconds)}
              </span>
              <span className="text-ae-text-muted text-xs text-center px-4">
                {getModeLabel(mode)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

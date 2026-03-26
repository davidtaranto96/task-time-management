"use client"

import type { Streak } from "@/types/dashboard"

interface StreakCardProps {
  streak: Streak | null
}

export default function StreakCard({ streak }: StreakCardProps) {
  if (!streak || streak.currentStreak === 0) {
    return (
      <div className="bg-ae-surface border border-ae-border rounded-2xl p-5 text-center">
        <p className="text-ae-text-muted text-sm">
          Comienza hoy tu racha de días exitosos 🔥
        </p>
      </div>
    )
  }

  const isWeekStreak = streak.currentStreak >= 7
  const borderColor = isWeekStreak ? "#f59e0b60" : "#2a2a35"
  const glowStyle = isWeekStreak
    ? { boxShadow: "0 0 24px #f59e0b22, 0 0 8px #f59e0b11" }
    : {}

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border p-5"
      style={{
        background: "#111113",
        borderColor,
        ...glowStyle,
      }}
    >
      {isWeekStreak && (
        <div className="flex items-center justify-center gap-2">
          <span
            className="text-ae-signal text-xs font-bold uppercase tracking-widest"
            style={{ textShadow: "0 0 8px #f59e0b77" }}
          >
            ¡Racha de una semana! 🏆
          </span>
        </div>
      )}

      {/* Main streak */}
      <div className="flex items-center justify-center gap-3">
        <span
          className="text-5xl"
          style={isWeekStreak ? { filter: "drop-shadow(0 0 8px #f59e0b88)" } : {}}
        >
          🔥
        </span>
        <div className="flex flex-col">
          <span
            className="font-bold tabular-nums leading-none"
            style={{
              fontSize: "3rem",
              color: isWeekStreak ? "#f59e0b" : "#f4f4f5",
            }}
          >
            {streak.currentStreak}
          </span>
          <span className="text-ae-text-muted text-sm">días consecutivos</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1 border-t border-ae-border pt-3">
        <span className="text-ae-text-muted text-sm">
          🏅 {streak.longestStreak} días — tu mejor racha
        </span>
        <span className="text-ae-text-muted text-sm">
          ✅ {streak.totalSuccessfulDays} días exitosos en total
        </span>
      </div>
    </div>
  )
}

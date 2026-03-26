"use client"

import type { TimerMode, TimerState } from "@/types/timer"

interface TimerControlsProps {
  timer: TimerState
  onStart: (mode: TimerMode) => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  activeTaskId: string | null
}

const MODES: { mode: TimerMode; label: string }[] = [
  { mode: "pomodoro_25", label: "25 min" },
  { mode: "pomodoro_50", label: "50 min" },
  { mode: "musk_5", label: "5 min Musk" },
]

export default function TimerControls({
  timer,
  onStart,
  onPause,
  onResume,
  onStop,
  activeTaskId,
}: TimerControlsProps) {
  const isIdle = timer.status === "idle" || timer.status === "completed"
  const isRunning = timer.status === "running"
  const isPaused = timer.status === "paused"
  const isActive = isRunning || isPaused
  const disabled = !activeTaskId

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Mode selector — only when idle */}
      {isIdle && (
        <div className="flex gap-2">
          {MODES.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => !disabled && onStart(mode)}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                ${timer.mode === mode
                  ? "bg-ae-signal text-ae-bg border-ae-signal shadow-md shadow-ae-signal/20"
                  : "bg-ae-surface border-ae-border text-ae-text-muted hover:border-ae-signal/50 hover:text-ae-text"
                }
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Start / Pause / Resume button */}
      <div className="flex items-center gap-3">
        {isIdle && (
          <button
            onClick={() => !disabled && onStart(timer.mode)}
            disabled={disabled}
            className={`bg-ae-signal text-ae-bg font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-ae-signal/30
              ${disabled ? "opacity-40 cursor-not-allowed" : "hover:brightness-110 active:scale-95 cursor-pointer"}
            `}
          >
            Iniciar
          </button>
        )}

        {isRunning && (
          <button
            onClick={onPause}
            className="bg-ae-signal text-ae-bg font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-ae-signal/30"
          >
            Pausar
          </button>
        )}

        {isPaused && (
          <button
            onClick={onResume}
            className="bg-ae-signal text-ae-bg font-bold text-lg px-10 py-4 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-ae-signal/30"
          >
            Continuar
          </button>
        )}

        {/* Stop button — only when running or paused */}
        {isActive && (
          <button
            onClick={onStop}
            className="bg-ae-surface border border-ae-border text-ae-text-muted text-sm px-4 py-2 rounded-lg hover:border-ae-danger/50 hover:text-ae-danger transition-all active:scale-95"
          >
            Detener
          </button>
        )}
      </div>

      {/* Sessions counter */}
      <p className="text-ae-text-muted text-sm">
        🍅 {timer.sessionsCompleted} sesiones hoy
      </p>
    </div>
  )
}

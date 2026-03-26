"use client"

import { useEffect, useState, useRef } from "react"

const MUSK_DURATION = 300 // 5 minutes in seconds

interface MuskTimerProps {
  taskTitle: string
  onComplete: () => void
  onStop: () => void
}

export default function MuskTimer({ taskTitle, onComplete, onStop }: MuskTimerProps) {
  const [remaining, setRemaining] = useState(MUSK_DURATION)
  const [expired, setExpired] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setExpired(true)
          setFlashing(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Flash effect when expired
  useEffect(() => {
    if (!flashing) return
    const timeout = setTimeout(() => setFlashing(false), 2000)
    return () => clearTimeout(timeout)
  }, [flashing])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  const progress = ((MUSK_DURATION - remaining) / MUSK_DURATION) * 100

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    onStop()
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
        flashing ? "bg-ae-danger/20" : "bg-ae-bg/95 backdrop-blur-sm"
      }`}
    >
      <div
        className={`w-full max-w-md bg-ae-surface border rounded-2xl p-6 flex flex-col gap-5 shadow-2xl transition-colors duration-300 ${
          flashing ? "border-ae-danger" : "border-ae-border"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-ae-signal text-lg">⚡</span>
          <p className="text-ae-signal font-bold text-sm tracking-wide uppercase">
            Modo Musk: 5 minutos para resolver esto
          </p>
        </div>

        {/* Task title */}
        <h2 className="text-ae-text font-bold text-xl leading-snug">{taskTitle}</h2>

        {/* Countdown */}
        <div
          className={`text-center font-mono font-bold text-6xl tracking-tighter transition-colors ${
            expired ? "text-ae-danger" : remaining <= 30 ? "text-ae-danger" : "text-ae-text"
          }`}
        >
          {formatted}
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-ae-surface-2 rounded-full overflow-hidden border border-ae-border">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              expired ? "bg-ae-danger" : remaining <= 30 ? "bg-ae-danger" : "bg-ae-signal"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Expired state */}
        {expired ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-ae-danger font-semibold text-base">
              ⏰ ¡Tiempo agotado! ¿Lo lograste?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onComplete}
                className="flex-1 bg-ae-success/90 hover:bg-ae-success text-ae-bg font-bold py-3 px-4 rounded-xl transition-all active:scale-95 text-sm"
              >
                ✓ Sí, listo
              </button>
              <button
                onClick={handleStop}
                className="flex-1 bg-ae-accent/90 hover:bg-ae-accent text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 text-sm"
              >
                → Patear
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleStop}
            className="self-center text-xs text-ae-text-muted hover:text-ae-text border border-ae-border hover:border-ae-text-muted px-4 py-2 rounded-lg transition-all"
          >
            Detener
          </button>
        )}
      </div>
    </div>
  )
}

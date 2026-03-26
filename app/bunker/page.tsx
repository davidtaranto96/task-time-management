"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useTaskStore } from "@/store/taskStore"
import { useTimerStore } from "@/store/timerStore"
import { useSettingsStore } from "@/store/settingsStore"
import PomodoroTimer from "@/components/bunker/PomodoroTimer"
import TimerControls from "@/components/bunker/TimerControls"
import ActiveTask from "@/components/bunker/ActiveTask"
import CEOLock from "@/components/bunker/CEOLock"
import type { TimerMode } from "@/types/timer"
import type { Task } from "@/types/task"

export default function BunkerPage() {
  const { loadToday, getSignalTasks, getGoldenTask, completeTask, isLoaded } = useTaskStore()
  const {
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    tickTimer,
    setMode,
  } = useTimerStore()
  const { ceoFocusMode, toggleCeoFocus, preferredTimerMode } = useSettingsStore()

  const [taskCompleted, setTaskCompleted] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Load today's tasks and set preferred timer mode on mount
  useEffect(() => {
    loadToday()
    setMode(preferredTimerMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resolve active task: golden task takes priority, then first signal task
  useEffect(() => {
    if (!isLoaded) return
    const golden = getGoldenTask()
    const signalTasks = getSignalTasks()
    const pending = signalTasks.filter(
      (t) => t.status !== "done" && t.status !== "deleted" && t.status !== "deferred" && t.status !== "delegated"
    )
    if (golden && golden.status !== "done") {
      setActiveTask(golden)
    } else if (pending.length > 0) {
      setActiveTask(pending[0])
    } else {
      setActiveTask(null)
    }
  }, [isLoaded, getGoldenTask, getSignalTasks, taskCompleted])

  const handleStart = useCallback(
    (mode: TimerMode) => {
      if (!activeTask) return
      startTimer(activeTask.id, mode)
    },
    [activeTask, startTimer]
  )

  const handleCompleteTask = useCallback(async () => {
    if (!activeTask) return
    await completeTask(activeTask.id)
    stopTimer()
    setTaskCompleted(true)
  }, [activeTask, completeTask, stopTimer])

  const handleSkipTask = useCallback(() => {
    // Move to next signal task by re-evaluating
    const signalTasks = getSignalTasks()
    const pending = signalTasks.filter(
      (t) =>
        t.status !== "done" &&
        t.status !== "deleted" &&
        t.status !== "deferred" &&
        t.status !== "delegated" &&
        t.id !== activeTask?.id
    )
    setActiveTask(pending[0] ?? null)
  }, [activeTask, getSignalTasks])

  const handleNextSession = useCallback(() => {
    setTaskCompleted(false)
    stopTimer()
  }, [stopTimer])

  const isRunning = timer.status === "running"

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ae-bg flex items-center justify-center">
        <div className="text-ae-text-muted text-sm animate-pulse">Preparando el Bunker...</div>
      </div>
    )
  }

  return (
    <>
      {/* CEO Focus Mode overlay */}
      <CEOLock
        active={ceoFocusMode}
        taskTitle={activeTask?.title ?? ""}
        onDeactivate={toggleCeoFocus}
      />

      <div className="min-h-screen bg-ae-bg text-ae-text flex flex-col">
        <div className="max-w-lg mx-auto w-full flex flex-col flex-1 py-6 px-4 gap-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/intake"
                className="text-ae-text-muted hover:text-ae-text transition-colors text-lg"
                aria-label="Volver al Filtro de Decisiones"
              >
                ←
              </Link>
              <h1 className="text-xl font-bold text-ae-text tracking-tight">El Bunker</h1>
            </div>

            {/* CEO Focus toggle */}
            <button
              onClick={toggleCeoFocus}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                ${ceoFocusMode
                  ? "bg-ae-accent/20 border-ae-accent text-ae-accent"
                  : "bg-ae-surface border-ae-border text-ae-text-muted hover:border-ae-accent/50 hover:text-ae-accent"
                }`}
            >
              {ceoFocusMode ? "▮ Modo CEO" : "Modo CEO"}
            </button>
          </div>

          {/* No signal tasks state */}
          {!activeTask && !taskCompleted && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-ae-text-muted text-lg">
                No tienes tareas en Zona Señal.
              </p>
              <Link
                href="/intake"
                className="text-ae-signal font-medium hover:underline"
              >
                Vuelve al Filtro de Decisiones →
              </Link>
            </div>
          )}

          {/* Task completed celebration state */}
          {taskCompleted && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="text-2xl font-bold text-ae-text">¡Tarea completada!</h2>
              <p className="text-ae-text-muted text-sm">Gran trabajo. ¿Qué sigue?</p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={handleNextSession}
                  className="bg-ae-signal text-ae-bg font-bold py-3 px-8 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-ae-signal/20"
                >
                  Siguiente tarea
                </button>
                <Link
                  href="/bandeja"
                  className="text-ae-text-muted text-sm text-center hover:text-ae-text transition-colors"
                >
                  Ver todas las tareas →
                </Link>
              </div>
            </div>
          )}

          {/* Main bunker content */}
          {activeTask && !taskCompleted && (
            <>
              {/* Active task */}
              <ActiveTask
                task={activeTask}
                onComplete={handleCompleteTask}
                onSkip={handleSkipTask}
              />

              {/* Divider */}
              <div className="border-t border-ae-border" />

              {/* Timer */}
              <div className="flex flex-col items-center gap-6">
                <PomodoroTimer
                  remainingSeconds={timer.remainingSeconds}
                  totalSeconds={timer.totalSeconds}
                  status={timer.status}
                  mode={timer.mode}
                  onTick={tickTimer}
                />

                <TimerControls
                  timer={timer}
                  onStart={handleStart}
                  onPause={pauseTimer}
                  onResume={resumeTimer}
                  onStop={stopTimer}
                  activeTaskId={activeTask.id}
                />
              </div>

              {/* Timer completed — offer next session or mark done */}
              {timer.status === "completed" && (
                <div className="bg-ae-surface border border-ae-border rounded-xl p-4 flex flex-col items-center gap-3 text-center">
                  <p className="text-ae-success font-semibold">Sesion completada</p>
                  <p className="text-ae-text-muted text-sm">¿Deseas marcar la tarea como hecha o iniciar otra sesión?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCompleteTask}
                      className="bg-ae-success/90 hover:bg-ae-success text-ae-bg font-bold px-5 py-2 rounded-lg text-sm transition-all active:scale-95"
                    >
                      Tarea completada ✓
                    </button>
                    <button
                      onClick={() => handleStart(timer.mode)}
                      className="bg-ae-surface-2 border border-ae-border text-ae-text-muted px-5 py-2 rounded-lg text-sm hover:text-ae-text transition-all active:scale-95"
                    >
                      Otra sesión
                    </button>
                  </div>
                </div>
              )}

              {/* View all tasks — only when not running */}
              {!isRunning && timer.status !== "completed" && (
                <div className="flex justify-center">
                  <Link
                    href="/bandeja"
                    className="text-ae-text-muted text-sm hover:text-ae-text transition-colors"
                  >
                    Ver todas las tareas →
                  </Link>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}

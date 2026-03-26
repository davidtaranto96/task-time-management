"use client"

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useTaskStore } from '@/store/taskStore'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { FocusTimer } from '@/components/enfoque/FocusTimer'
import { TimerModeSelector } from '@/components/enfoque/TimerModeSelector'
import { TaskSelector } from '@/components/enfoque/TaskSelector'
import { SubtaskChecklist } from '@/components/enfoque/SubtaskChecklist'
import type { TimerMode } from '@/types/timer'

function playCompletionSound() {
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return
  const ctx = new AudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 528
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 1)
}

export default function EnfoquePage() {
  const { tasks, loadToday, completeTask, isLoaded } = useTaskStore()
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, tickTimer, setMode, isRunning, isPaused } =
    useTimerStore()
  const { preferredTimerMode } = useSettingsStore()

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [completedMessage, setCompletedMessage] = useState(false)

  // Load today's tasks on mount and set preferred timer mode
  useEffect(() => {
    loadToday()
    setMode(preferredTimerMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-select first primordial task when tasks load
  useEffect(() => {
    if (!isLoaded || selectedTaskId) return
    const taskList = Object.values(tasks)
    const active = taskList.filter(
      (t) => t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred'
    )
    const primordial = active.find((t) => t.priority === 'primordial')
    const first = primordial ?? active[0]
    if (first) setSelectedTaskId(first.id)
  }, [isLoaded, tasks, selectedTaskId])

  // Play sound and show completed message when a work session finishes
  useEffect(() => {
    if (timer.status === 'completed' && !timer.isBreak) {
      setCompletedMessage(true)
      playCompletionSound()
    }
    if (timer.status === 'idle' || timer.status === 'running') {
      setCompletedMessage(false)
    }
  }, [timer.status, timer.isBreak])

  const handleModeChange = useCallback(
    (mode: TimerMode) => {
      setMode(mode)
      setCompletedMessage(false)
    },
    [setMode]
  )

  const handleStart = () => {
    if (!selectedTaskId) return
    setCompletedMessage(false)
    startTimer(selectedTaskId, timer.mode)
  }

  const handleStop = () => {
    stopTimer()
    setCompletedMessage(false)
  }

  const handleMarkDone = async () => {
    if (!selectedTaskId) return
    await completeTask(selectedTaskId)

    // Auto-select next task
    const taskList = Object.values(tasks)
    const next = taskList.find(
      (t) =>
        t.id !== selectedTaskId &&
        t.status !== 'done' &&
        t.status !== 'deleted' &&
        t.status !== 'deferred'
    )
    setSelectedTaskId(next?.id ?? null)
    stopTimer()
    setCompletedMessage(false)
  }

  const handleAnotherSession = () => {
    setCompletedMessage(false)
    stopTimer()
  }

  const taskList = Object.values(tasks)
  const selectedTask = selectedTaskId ? tasks[selectedTaskId] : null
  const running = isRunning()
  const paused = isPaused()
  const isActive = running || paused

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {timer.isBreak ? (
          <h1 className="text-sm font-medium text-green-400">🌿 Descanso</h1>
        ) : (
          <h1 className="text-sm font-medium text-ae-text-muted">🎯 Enfoque</h1>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ae-surface-2 px-3 py-1 text-sm font-medium text-amber-400">
          <span className="text-base">🍅</span> {timer.sessionsCompleted}
        </span>
      </div>

      {/* No task selected empty state */}
      {!selectedTaskId && isLoaded && (
        <div className="mb-6 rounded-xl border border-ae-border bg-ae-surface p-6 text-center">
          <p className="text-ae-text-muted">Elegí una tarea para empezar a enfocarte</p>
          <Link
            href="/hoy"
            className="mt-3 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            Ir a Hoy →
          </Link>
        </div>
      )}

      {/* Task selector */}
      {isLoaded && taskList.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ae-text-muted">
            Tarea
          </p>
          <TaskSelector
            tasks={taskList}
            selectedTaskId={selectedTaskId}
            onSelect={(id) => {
              if (!isActive) {
                setSelectedTaskId(id)
                setCompletedMessage(false)
              }
            }}
          />
        </div>
      )}

      {/* Selected task title */}
      {selectedTask && (
        <p className="mb-6 truncate text-center text-lg font-semibold text-ae-text">
          {selectedTask.title}
        </p>
      )}

      {/* Timer */}
      <div className="mb-6 flex justify-center">
        <FocusTimer
          remainingSeconds={timer.remainingSeconds}
          totalSeconds={timer.totalSeconds}
          status={timer.status}
          mode={timer.mode}
          isBreak={timer.isBreak}
          onTick={tickTimer}
        />
      </div>

      {/* Break transition overlay */}
      {timer.status === 'completed' && !timer.isBreak && timer.breakMode && (
        <div className="mb-6 animate-fade-in rounded-xl border border-green-700 bg-green-950/60 p-4 text-center backdrop-blur-sm">
          <p className="text-lg font-semibold text-green-300 animate-pulse">
            ¡Sesión completada! Iniciando descanso...
          </p>
        </div>
      )}

      {/* Break running indicator */}
      {timer.isBreak && timer.status === 'running' && (
        <div className="mb-4 rounded-xl border border-green-700 bg-green-950/40 p-3 text-center">
          <p className="text-sm font-medium text-green-400">
            Tiempo de descanso — relájate un momento
          </p>
        </div>
      )}

      {/* Timer completed state (work session, no auto-break) */}
      {completedMessage && !timer.breakMode ? (
        <div className="mb-6 flex flex-col items-center gap-4">
          <p className="text-center text-lg font-semibold text-green-400">
            ¡Sesión completada!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleMarkDone}
              className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-green-400"
            >
              Marcar tarea como hecha ✓
            </button>
            <button
              onClick={handleAnotherSession}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-amber-400"
            >
              Otra sesión
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex flex-col items-center gap-4">
          {/* Mode selector (only when idle and not in break) */}
          {timer.status === 'idle' && !timer.isBreak && (
            <div className="w-full">
              <TimerModeSelector
                selectedMode={timer.mode}
                onChange={handleModeChange}
                disabled={isActive}
              />
            </div>
          )}

          {/* "Ready for another session?" prompt after break ends */}
          {timer.status === 'idle' && timer.sessionsCompleted > 0 && !timer.isBreak && (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
              <p className="text-sm text-ae-text-muted">¿Listo para otra sesión?</p>
              <button
                onClick={handleStart}
                disabled={!selectedTaskId}
                className="rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 animate-bounce-subtle"
              >
                Empezar otra sesión
              </button>
            </div>
          )}

          {/* Start / Pause / Resume — hide during break auto-transition */}
          {!(timer.status === 'completed' && timer.breakMode) && !timer.isBreak && (
            <div className="flex items-center gap-3">
              {!isActive ? (
                <button
                  onClick={handleStart}
                  disabled={!selectedTaskId}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {timer.status === 'idle' && timer.sessionsCompleted > 0 ? 'Empezar' : 'Iniciar'}
                </button>
              ) : running ? (
                <button
                  onClick={pauseTimer}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-amber-400"
                >
                  Pausar
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-amber-400"
                >
                  Continuar
                </button>
              )}

              {/* Stop button */}
              {isActive && (
                <button
                  onClick={handleStop}
                  className="rounded-xl bg-ae-surface-2 px-4 py-3 text-sm font-medium text-ae-text-muted transition-colors hover:text-ae-text"
                >
                  Detener
                </button>
              )}
            </div>
          )}

          {/* Skip break button */}
          {timer.isBreak && (
            <button
              onClick={handleStop}
              className="rounded-xl bg-ae-surface-2 px-5 py-2.5 text-sm font-medium text-ae-text-muted transition-colors hover:text-ae-text"
            >
              Saltar descanso
            </button>
          )}
        </div>
      )}

      {/* Subtask checklist */}
      {selectedTask && selectedTask.subtaskIds && selectedTask.subtaskIds.length > 0 && (
        <div className="rounded-xl border border-ae-border bg-ae-surface p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ae-text-muted">
            Subtareas
          </p>
          <SubtaskChecklist
            subtaskIds={selectedTask.subtaskIds}
            onToggle={() => {}}
          />
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useTimerStore } from '@/store/timerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { FocusTimer } from '@/components/enfoque/FocusTimer'
import { TimerModeSelector } from '@/components/enfoque/TimerModeSelector'
import { TaskSelector } from '@/components/enfoque/TaskSelector'
import { SubtaskChecklist } from '@/components/enfoque/SubtaskChecklist'
import type { TimerMode } from '@/types/timer'
import { hapticSuccess, hapticMedium, hapticHeavy, hapticLight } from '@/lib/haptics'

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
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, setMode, isRunning, isPaused } =
    useTimerStore()
  const { preferredTimerMode } = useSettingsStore()

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [completedMessage, setCompletedMessage] = useState(false)
  const [showTaskDoneDialog, setShowTaskDoneDialog] = useState(false)

  // Load tasks on mount — only set preferred mode if no session is active
  useEffect(() => {
    loadToday()
    if (timer.status === 'idle') {
      setMode(preferredTimerMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync selectedTaskId with active timer task when returning to the page
  useEffect(() => {
    if (timer.activeTaskId && !selectedTaskId) {
      setSelectedTaskId(timer.activeTaskId)
    }
  }, [timer.activeTaskId, selectedTaskId])

  // Auto-select first primordial task when tasks load (only if no active session)
  useEffect(() => {
    if (!isLoaded || selectedTaskId || timer.status !== 'idle') return
    const taskList = Object.values(tasks)
    const active = taskList.filter(
      (t) => t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred'
    )
    const primordial = active.find((t) => t.priority === 'primordial')
    const first = primordial ?? active[0]
    if (first) setSelectedTaskId(first.id)
  }, [isLoaded, tasks, selectedTaskId, timer.status])

  // Sound + haptics on session events
  useEffect(() => {
    if (timer.status === 'completed' && !timer.isBreak) {
      setCompletedMessage(true)
      playCompletionSound()
      hapticHeavy()
    }
    if (timer.status === 'running' && timer.isBreak) hapticMedium()
    if (timer.status === 'idle' && !timer.isBreak && timer.sessionsCompleted > 0) hapticHeavy()
    if (timer.status === 'idle' || timer.status === 'running') setCompletedMessage(false)
  }, [timer.status, timer.isBreak])

  const handleModeChange = useCallback(
    (mode: TimerMode) => { setMode(mode); setCompletedMessage(false) },
    [setMode]
  )

  const handleStart = () => {
    hapticMedium()
    setCompletedMessage(false)
    startTimer(selectedTaskId, timer.mode)
  }

  const handleStop = () => {
    hapticLight()
    if (selectedTaskId && isActive) {
      setShowTaskDoneDialog(true)
    } else {
      stopTimer()
      setCompletedMessage(false)
    }
  }

  const handleTaskDoneAnswer = async (done: boolean) => {
    if (done && selectedTaskId) {
      await completeTask(selectedTaskId)
      hapticSuccess()
      const next = Object.values(tasks).find(
        (t) => t.id !== selectedTaskId && t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred'
      )
      setSelectedTaskId(next?.id ?? null)
    }
    stopTimer()
    setCompletedMessage(false)
    setShowTaskDoneDialog(false)
  }

  const handleMarkDone = async () => {
    if (!selectedTaskId) return
    await completeTask(selectedTaskId)
    hapticSuccess()
    const next = Object.values(tasks).find(
      (t) => t.id !== selectedTaskId && t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred'
    )
    setSelectedTaskId(next?.id ?? null)
    stopTimer()
    setCompletedMessage(false)
  }

  const handleAnotherSession = () => { setCompletedMessage(false); stopTimer() }

  const taskList = Object.values(tasks)
  const selectedTask = selectedTaskId ? tasks[selectedTaskId] : null
  const running = isRunning()
  const paused = isPaused()
  const isActive = running || paused

  return (
    <div
      className="mx-auto max-w-lg px-4 py-3 flex flex-col gap-3 overflow-hidden"
      style={{ height: 'calc(100dvh - 80px)' }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="page-title text-ae-text">
            {timer.isBreak ? '🌿 Descanso' : '🎯 Enfoque'}
          </h1>
          <p className="text-xs text-ae-text-muted leading-none mt-0.5">
            {timer.isBreak ? 'Tomá un respiro' : isActive ? '🔒 Sesión activa' : 'Mantené el foco'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-ae-surface-2 px-3 py-1 text-sm font-medium text-amber-400">
          🍅 {timer.sessionsCompleted}
        </span>
      </header>

      {/* ── Task selector (compact) ── */}
      {isLoaded && (
        <div className="flex-shrink-0">
          <TaskSelector
            tasks={taskList}
            selectedTaskId={selectedTaskId}
            onSelect={(id) => {
              if (!isActive) { setSelectedTaskId(id); setCompletedMessage(false) }
            }}
            disabled={isActive}
          />
        </div>
      )}

      {/* ── Timer — flex-1 so it fills available space, centered ── */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <FocusTimer
          remainingSeconds={timer.remainingSeconds}
          totalSeconds={timer.totalSeconds}
          status={timer.status}
          mode={timer.mode}
          isBreak={timer.isBreak}
        />

        {/* Inline status messages */}
        {timer.status === 'completed' && !timer.isBreak && timer.breakMode && (
          <p className="mt-3 text-sm font-semibold text-green-300 animate-pulse text-center">
            ¡Sesión completada! Iniciando descanso...
          </p>
        )}
        {timer.isBreak && timer.status === 'running' && (
          <p className="mt-3 text-sm font-medium text-green-400 text-center">
            🌿 Relájate un momento
          </p>
        )}

        {/* Subtask checklist inline (compact) */}
        {selectedTask?.subtaskIds && selectedTask.subtaskIds.length > 0 && (
          <div className="mt-3 w-full max-w-xs rounded-xl border border-ae-border bg-ae-surface p-3">
            <SubtaskChecklist subtaskIds={selectedTask.subtaskIds} onToggle={() => {}} />
          </div>
        )}
      </div>

      {/* ── Bottom controls ── */}
      <div className="flex-shrink-0 flex flex-col gap-2 pb-1">
        {completedMessage && !timer.breakMode ? (
          /* Completed state */
          <div className="flex flex-col items-center gap-3">
            <p className="text-base font-semibold text-green-400">¡Sesión completada! 🎉</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {selectedTaskId && (
                <button
                  onClick={handleMarkDone}
                  className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black active:scale-95 transition-transform"
                >
                  ✅ La completé
                </button>
              )}
              <button
                onClick={handleAnotherSession}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black active:scale-95 transition-transform"
              >
                {selectedTaskId ? '⏭ Seguir pendiente' : 'Otra sesión'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode selector — only when idle, not in break */}
            {timer.status === 'idle' && !timer.isBreak && (
              <TimerModeSelector
                selectedMode={timer.mode}
                onChange={handleModeChange}
                disabled={isActive}
              />
            )}

            {/* Action buttons */}
            {!(timer.status === 'completed' && timer.breakMode) && !timer.isBreak && (
              <div className="flex items-center justify-center gap-3">
                {!isActive ? (
                  <button
                    onClick={handleStart}
                    className="rounded-2xl bg-amber-500 px-10 py-3 text-base font-bold text-black active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
                  >
                    {timer.sessionsCompleted > 0 ? 'Empezar' : 'Iniciar'}
                  </button>
                ) : running ? (
                  <button
                    onClick={pauseTimer}
                    className="rounded-2xl bg-amber-500 px-10 py-3 text-base font-bold text-black active:scale-95 transition-transform"
                  >
                    Pausar
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="rounded-2xl bg-amber-500 px-10 py-3 text-base font-bold text-black active:scale-95 transition-transform"
                  >
                    Continuar
                  </button>
                )}
                {isActive && (
                  <button
                    onClick={handleStop}
                    className="rounded-2xl bg-ae-surface-2 border border-ae-border px-5 py-3 text-sm font-medium text-ae-text-muted active:scale-95 transition-transform"
                  >
                    Detener
                  </button>
                )}
              </div>
            )}

            {timer.isBreak && (
              <div className="flex justify-center">
                <button
                  onClick={handleStop}
                  className="rounded-2xl bg-ae-surface-2 border border-ae-border px-6 py-2.5 text-sm font-medium text-ae-text-muted active:scale-95 transition-transform"
                >
                  Saltar descanso
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Task done dialog ── */}
      {showTaskDoneDialog && selectedTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-ae-surface rounded-2xl border border-ae-border shadow-xl p-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-ae-text">¿Esta tarea se realizó?</h2>
            <p className="text-sm text-ae-text-muted truncate">{selectedTask?.title}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleTaskDoneAnswer(true)}
                className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black"
              >
                ✅ Sí, la completé
              </button>
              <button
                onClick={() => handleTaskDoneAnswer(false)}
                className="flex-1 rounded-xl bg-ae-surface-2 px-4 py-2.5 text-sm font-medium text-ae-text-muted"
              >
                No, seguir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

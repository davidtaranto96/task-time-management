import { create } from 'zustand'
import type { TimerMode, TimerStatus, TimerState } from '@/types/timer'
import { TIMER_DURATIONS } from '@/types/timer'
import { sendTimerCompleteNotification } from '@/lib/notifications'

interface TimerStoreState {
  timer: TimerState

  startTimer: (taskId: string, mode: TimerMode) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  tickTimer: () => void
  completeTimer: () => void
  setMode: (mode: TimerMode) => void

  isRunning: () => boolean
  isPaused: () => boolean
  progressPercent: () => number
}

const BREAK_MAP: Partial<Record<TimerMode, TimerMode>> = {
  pomodoro_25: 'break_5',
  pomodoro_50: 'break_10',
  deep_work_90: 'break_15',
}

const initialTimer: TimerState = {
  mode: 'pomodoro_50',
  status: 'idle' as TimerStatus,
  activeTaskId: null,
  remainingSeconds: TIMER_DURATIONS['pomodoro_50'],
  totalSeconds: TIMER_DURATIONS['pomodoro_50'],
  sessionsCompleted: 0,
  startedAt: null,
  isBreak: false,
  breakMode: null,
  workMode: 'pomodoro_50',
}

export const useTimerStore = create<TimerStoreState>()((set, get) => ({
  timer: initialTimer,

  startTimer: (taskId, mode) => {
    const duration = TIMER_DURATIONS[mode]
    set({
      timer: {
        ...get().timer,
        mode,
        workMode: mode,
        status: 'running' as TimerStatus,
        activeTaskId: taskId,
        remainingSeconds: duration,
        totalSeconds: duration,
        startedAt: new Date().toISOString(),
      },
    })
  },

  pauseTimer: () => {
    set((s) => ({
      timer: { ...s.timer, status: 'paused' as TimerStatus },
    }))
  },

  resumeTimer: () => {
    set((s) => ({
      timer: { ...s.timer, status: 'running' as TimerStatus },
    }))
  },

  stopTimer: () => {
    set((s) => {
      // Always restore to the original work mode (preserved across breaks)
      const resetMode: TimerMode = s.timer.workMode
      return {
        timer: {
          ...s.timer,
          mode: resetMode,
          status: 'idle' as TimerStatus,
          activeTaskId: null,
          startedAt: null,
          remainingSeconds: TIMER_DURATIONS[resetMode],
          totalSeconds: TIMER_DURATIONS[resetMode],
          isBreak: false,
          breakMode: null,
        },
      }
    })
  },

  tickTimer: () => {
    const { timer } = get()
    if (timer.status !== 'running') return
    if (timer.remainingSeconds <= 1) {
      get().completeTimer()
    } else {
      set((s) => ({
        timer: { ...s.timer, remainingSeconds: s.timer.remainingSeconds - 1 },
      }))
    }
  },

  completeTimer: () => {
    const { timer } = get()

    if (timer.isBreak) {
      // Break finished — restore original work mode and return to idle
      const restoreMode = timer.workMode
      const restoreDuration = TIMER_DURATIONS[restoreMode]
      set((s) => ({
        timer: {
          ...s.timer,
          mode: restoreMode,
          status: 'idle' as TimerStatus,
          remainingSeconds: restoreDuration,
          totalSeconds: restoreDuration,
          isBreak: false,
          breakMode: null,
        },
      }))
      return
    }

    // Work session finished
    const breakMode = BREAK_MAP[timer.mode] ?? null
    set((s) => ({
      timer: {
        ...s.timer,
        status: 'completed' as TimerStatus,
        remainingSeconds: 0,
        sessionsCompleted: s.timer.sessionsCompleted + 1,
        breakMode,
      },
    }))
    sendTimerCompleteNotification('', timer.mode)

    if (breakMode) {
      setTimeout(() => {
        const breakDuration = TIMER_DURATIONS[breakMode]
        set((s) => ({
          timer: {
            ...s.timer,
            mode: breakMode,
            isBreak: true,
            status: 'running' as TimerStatus,
            remainingSeconds: breakDuration,
            totalSeconds: breakDuration,
          },
        }))
      }, 2000)
    }
  },

  setMode: (mode) => {
    const duration = TIMER_DURATIONS[mode]
    set((s) => ({
      timer: {
        ...s.timer,
        mode,
        workMode: mode,
        remainingSeconds: duration,
        totalSeconds: duration,
        status: 'idle' as TimerStatus,
        startedAt: null,
        activeTaskId: null,
      },
    }))
  },

  isRunning: () => get().timer.status === 'running',

  isPaused: () => get().timer.status === 'paused',

  progressPercent: () => {
    const { remainingSeconds, totalSeconds } = get().timer
    if (totalSeconds === 0) return 0
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100
  },
}))

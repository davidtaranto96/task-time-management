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

const initialTimer: TimerState = {
  mode: 'pomodoro_50',
  status: 'idle' as TimerStatus,
  activeTaskId: null,
  remainingSeconds: TIMER_DURATIONS['pomodoro_50'],
  totalSeconds: TIMER_DURATIONS['pomodoro_50'],
  sessionsCompleted: 0,
  startedAt: null,
}

export const useTimerStore = create<TimerStoreState>()((set, get) => ({
  timer: initialTimer,

  startTimer: (taskId, mode) => {
    const duration = TIMER_DURATIONS[mode]
    set({
      timer: {
        ...get().timer,
        mode,
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
    set((s) => ({
      timer: {
        ...s.timer,
        status: 'idle' as TimerStatus,
        activeTaskId: null,
        startedAt: null,
        remainingSeconds: TIMER_DURATIONS[s.timer.mode],
        totalSeconds: TIMER_DURATIONS[s.timer.mode],
      },
    }))
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
    set((s) => ({
      timer: {
        ...s.timer,
        status: 'completed' as TimerStatus,
        remainingSeconds: 0,
        sessionsCompleted: s.timer.sessionsCompleted + 1,
      },
    }))
    sendTimerCompleteNotification()
  },

  setMode: (mode) => {
    const duration = TIMER_DURATIONS[mode]
    set((s) => ({
      timer: {
        ...s.timer,
        mode,
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

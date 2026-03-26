export type TimerMode = "pomodoro_25" | "pomodoro_50" | "musk_5" | "break_5" | "break_10"
export type TimerStatus = "idle" | "running" | "paused" | "completed"

export interface TimerState {
  mode: TimerMode
  status: TimerStatus
  activeTaskId: string | null
  remainingSeconds: number
  totalSeconds: number
  sessionsCompleted: number
  startedAt: string | null
}

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  pomodoro_25: 25 * 60,
  pomodoro_50: 50 * 60,
  musk_5: 5 * 60,
  break_5: 5 * 60,
  break_10: 10 * 60,
}

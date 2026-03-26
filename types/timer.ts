export type TimerMode = 'pomodoro_25' | 'pomodoro_50' | 'deep_work_90' | 'quick_5' | 'break_5' | 'break_10' | 'break_15'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerState {
  mode: TimerMode
  status: TimerStatus
  activeTaskId: string | null
  remainingSeconds: number
  totalSeconds: number
  sessionsCompleted: number
  startedAt: string | null
  isBreak: boolean
  breakMode: TimerMode | null
}

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  pomodoro_25: 25 * 60,
  pomodoro_50: 50 * 60,
  deep_work_90: 90 * 60,
  quick_5: 5 * 60,
  break_5: 5 * 60,
  break_10: 10 * 60,
  break_15: 15 * 60,
}

export const TIMER_LABELS: Record<TimerMode, string> = {
  pomodoro_25: 'Pomodoro 25 min',
  pomodoro_50: 'Trabajo profundo 50 min',
  deep_work_90: 'Trabajo profundo 90 min',
  quick_5: 'Rápido 5 min',
  break_5: 'Descanso 5 min',
  break_10: 'Descanso 10 min',
  break_15: 'Descanso 15 min',
}

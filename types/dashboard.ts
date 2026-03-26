import type { TaskZone } from "./task"
import type { TimerMode } from "./timer"

export interface ImpactSession {
  id: string
  taskId: string
  taskTitle: string
  zone: TaskZone
  startedAt: string
  endedAt: string
  durationMinutes: number
  timerMode: TimerMode
  dayId: string
}

export interface DayMetrics {
  dayId: string
  isSuccessful: boolean
  primordialTasksTotal: number
  primordialTasksDone: number
  highImpactHours: number
  totalImpactSessions: number
}

export interface Streak {
  currentStreak: number
  longestStreak: number
  lastSuccessfulDay: string | null
  totalSuccessfulDays: number
}

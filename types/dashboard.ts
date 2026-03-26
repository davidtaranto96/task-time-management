import type { TimerMode } from "./timer"

export interface ImpactSession {
  id: string
  taskId: string
  taskTitle: string
  zone: 'signal' | 'noise' | 'primordial' | 'secondary'
  startedAt: string
  endedAt: string
  durationMinutes: number
  timerMode: TimerMode
  dayId: string
}

export interface DayMetrics {
  id: string
  dayId: string
  isSuccessful: boolean
  primordialTotal: number
  primordialDone: number
  highImpactHours: number
  totalImpactSessions: number
  createdAt: string
}

export interface Streak {
  id: string
  currentCount: number
  longestCount: number
  lastSuccessfulDay: string | null
  updatedAt: string
}

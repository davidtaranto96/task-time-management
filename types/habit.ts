import type { AreaKey } from './area'

export type HabitFrequency = 'daily' | 'weekly'

export interface Habit {
  id: string
  title: string
  description?: string
  frequency: HabitFrequency
  area?: AreaKey
  color?: string
  icon?: string
  isArchived: boolean
  createdAt: string
}

export interface HabitCompletion {
  id: string
  habitId: string
  dayId: string        // YYYY-MM-DD
  completedAt: string  // ISO datetime
}

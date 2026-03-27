import type { AreaKey } from './area'

export type TaskPriority = 'primordial' | 'importante' | 'puede_esperar' | 'secundaria'
export type TaskAction = 'do' | 'delegate' | 'defer' | 'delete'
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'deferred' | 'delegated' | 'deleted'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  action?: TaskAction
  area?: AreaKey
  delegatedTo?: string
  deferredTo?: string         // YYYY-MM-DD
  scheduledDate?: string      // YYYY-MM-DD — when this task is scheduled for
  reminder?: string           // ISO datetime — optional reminder
  parentProjectId?: string    // links to a Project
  subtaskIds?: string[]       // ordered subtask IDs
  createdAt: string           // ISO datetime
  completedAt?: string        // ISO datetime
  estimatedMinutes?: number
  dayId: string               // YYYY-MM-DD — the day this task belongs to
  // Deprecated fields kept for migration compatibility
  zone?: 'signal' | 'noise'
  decisionType?: 'type1' | 'type2'
  isGoldenTask?: boolean
  projectId?: string          // old field name, use parentProjectId instead
}

export interface DailyPlan {
  dayId: string
  goldenQuestion?: string
  tasks: string[]
  createdAt: string
}

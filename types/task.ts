export type TaskZone = "signal" | "noise"
export type TaskPriority = "primordial" | "secondary"
export type DecisionType = "type1" | "type2"
export type TaskAction = "do" | "delegate" | "defer" | "delete"
export type TaskStatus = "pending" | "in_progress" | "done" | "deferred" | "delegated" | "deleted"

export interface Task {
  id: string
  title: string
  description?: string
  zone: TaskZone
  priority: TaskPriority
  decisionType: DecisionType
  status: TaskStatus
  action?: TaskAction
  delegatedTo?: string
  deferredTo?: string
  createdAt: string
  completedAt?: string
  estimatedMinutes?: number
  isGoldenTask: boolean
  dayId: string
}

export interface DailyPlan {
  dayId: string
  goldenQuestion?: string
  tasks: string[]
  createdAt: string
}

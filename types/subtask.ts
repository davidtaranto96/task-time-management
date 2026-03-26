export interface Subtask {
  id: string
  parentTaskId: string
  title: string
  isCompleted: boolean
  order: number
  completedAt?: string  // ISO datetime
}

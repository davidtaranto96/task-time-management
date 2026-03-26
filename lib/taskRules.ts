import type { Task, TaskPriority, TaskAction } from '@/types'

// Max primordial tasks per day (rule of 3)
export const MAX_PRIMORDIAL = 3

// Max secondary tasks visible (practical limit)
export const MAX_SECONDARY = 20

// Check if adding another primordial task would exceed limit
export function wouldExceedPrimordial(currentPrimordialCount: number): boolean {
  return currentPrimordialCount >= MAX_PRIMORDIAL
}

// Recommend priority based on simple heuristics
export function recommendPriority(): TaskPriority {
  // Default to puede_esperar — user should actively promote to higher priority
  return 'puede_esperar'
}

// Recommend 4D action for a task
export function recommend4D(task: Task): TaskAction {
  if (task.status === 'done') return 'do'
  if (task.delegatedTo) return 'delegate'
  if (task.priority === 'puede_esperar' && isOlderThanDays(task, 2)) return 'defer'
  if (task.priority === 'puede_esperar') return 'defer'
  return 'do'
}

// Check if a task should be suggested for elimination (older than 3 days, still pending, low priority)
export function shouldSuggestElimination(task: Task): boolean {
  return (
    task.priority === 'puede_esperar' &&
    task.status === 'pending' &&
    isOlderThanDays(task, 3)
  )
}

// Check if a task can be promoted to primordial
export function canPromoteToPrimordial(currentPrimordialCount: number): { allowed: boolean; reason?: string } {
  if (currentPrimordialCount >= MAX_PRIMORDIAL) {
    return {
      allowed: false,
      reason: `Ya tenés ${MAX_PRIMORDIAL} tareas primordiales hoy. Completá o bajá la prioridad de alguna antes de agregar otra.`,
    }
  }
  return { allowed: true }
}

// Create a new task with sensible defaults
export function createTask(partial: Partial<Task> & { title: string; dayId: string }): Task {
  return {
    id: partial.id || crypto.randomUUID(),
    title: partial.title,
    description: partial.description,
    priority: partial.priority || 'puede_esperar',
    status: partial.status || 'pending',
    action: partial.action,
    area: partial.area,
    delegatedTo: partial.delegatedTo,
    deferredTo: partial.deferredTo,
    scheduledDate: partial.scheduledDate,
    reminder: partial.reminder,
    parentProjectId: partial.parentProjectId,
    subtaskIds: partial.subtaskIds || [],
    createdAt: partial.createdAt || new Date().toISOString(),
    completedAt: partial.completedAt,
    estimatedMinutes: partial.estimatedMinutes,
    dayId: partial.dayId,
  }
}

// Helper: check if task is older than N days
function isOlderThanDays(task: Task, days: number): boolean {
  const created = new Date(task.createdAt)
  const now = new Date()
  const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  return diff > days
}

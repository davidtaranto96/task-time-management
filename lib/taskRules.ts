import type { Task, TaskZone, TaskAction } from '@/types/task'

export const SIGNAL_ZONE_MAX = 2
export const NOISE_ZONE_MAX = 20
export const DECISION_FATIGUE_THRESHOLD = 3
export const CERO_RUIDO_HOUR = 12

export function wouldTriggerFatigue(currentSignalCount: number): boolean {
  return currentSignalCount >= DECISION_FATIGUE_THRESHOLD
}

export function isSignalZoneFull(currentSignalCount: number): boolean {
  return currentSignalCount >= SIGNAL_ZONE_MAX
}

export function recommendZone(task: Pick<Task, 'priority' | 'decisionType'>): TaskZone {
  if (task.priority === 'primordial' && task.decisionType === 'type1') {
    return 'signal'
  }
  return 'noise'
}

function isOlderThanDays(task: Task, days: number): boolean {
  const created = new Date(task.createdAt).getTime()
  const now = Date.now()
  const diffDays = (now - created) / (1000 * 60 * 60 * 24)
  return diffDays > days
}

export function recommend4D(task: Task): TaskAction {
  if (task.status === 'done') return 'do'
  if (task.delegatedTo) return 'delegate'
  if (task.zone === 'noise' && isOlderThanDays(task, 1)) return 'defer'
  if (task.zone === 'noise') return 'defer'
  return 'do'
}

export function shouldSuggestElimination(task: Task): boolean {
  return task.zone === 'noise' && task.status === 'pending' && isOlderThanDays(task, 2)
}

export function canMoveToSignal(currentSignalTasks: Task[]): { allowed: boolean; reason?: string } {
  if (currentSignalTasks.length >= SIGNAL_ZONE_MAX) {
    return {
      allowed: false,
      reason: `La zona de señal solo admite ${SIGNAL_ZONE_MAX} tareas primordiales (Regla Bezos).`,
    }
  }
  if (currentSignalTasks.length >= DECISION_FATIGUE_THRESHOLD) {
    return {
      allowed: false,
      reason: `Superas el umbral de fatiga de decisiones (${DECISION_FATIGUE_THRESHOLD} tareas).`,
    }
  }
  return { allowed: true }
}

export function createTask(partial: Partial<Task> & { title: string; dayId: string }): Task {
  const defaults: Task = {
    id: crypto.randomUUID(),
    title: partial.title,
    description: undefined,
    zone: 'noise',
    priority: 'secondary',
    decisionType: 'type2',
    status: 'pending',
    action: undefined,
    delegatedTo: undefined,
    deferredTo: undefined,
    createdAt: new Date().toISOString(),
    completedAt: undefined,
    estimatedMinutes: undefined,
    isGoldenTask: false,
    dayId: partial.dayId,
  }

  return { ...defaults, ...partial, id: defaults.id, createdAt: defaults.createdAt }
}

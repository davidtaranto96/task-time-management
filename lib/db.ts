import { get, set, del, keys, clear } from 'idb-keyval'
import type { Task } from '@/types/task'
import type { DailyPlan } from '@/types/task'
import type { ImpactSession, DayMetrics, Streak } from '@/types/dashboard'

// --- Tasks ---

export async function saveTask(task: Task): Promise<void> {
  await set(`ae:task:${task.id}`, task)
}

export async function getTask(id: string): Promise<Task | undefined> {
  return get<Task>(`ae:task:${id}`)
}

export async function getAllTasks(): Promise<Task[]> {
  const allKeys = await keys<string>()
  const taskKeys = allKeys.filter((k) => k.startsWith('ae:task:'))
  const tasks = await Promise.all(taskKeys.map((k) => get<Task>(k)))
  return tasks.filter((t): t is Task => t !== undefined)
}

export async function getTasksByDay(dayId: string): Promise<Task[]> {
  const all = await getAllTasks()
  return all.filter((task) => task.dayId === dayId)
}

export async function deleteTask(id: string): Promise<void> {
  await del(`ae:task:${id}`)
}

// --- Daily Plans ---

export async function saveDailyPlan(plan: DailyPlan): Promise<void> {
  await set(`ae:plan:${plan.dayId}`, plan)
}

export async function getDailyPlan(dayId: string): Promise<DailyPlan | undefined> {
  return get<DailyPlan>(`ae:plan:${dayId}`)
}

// --- Impact Sessions ---

export async function saveImpactSession(session: ImpactSession): Promise<void> {
  await set(`ae:session:${session.id}`, session)
}

export async function getImpactSessionsByDay(dayId: string): Promise<ImpactSession[]> {
  const allKeys = await keys<string>()
  const sessionKeys = allKeys.filter((k) => k.startsWith('ae:session:'))
  const sessions = await Promise.all(sessionKeys.map((k) => get<ImpactSession>(k)))
  return sessions.filter((s): s is ImpactSession => s !== undefined && s.dayId === dayId)
}

// --- Streak ---

export async function saveStreak(streak: Streak): Promise<void> {
  await set('ae:streak', streak)
}

export async function getStreak(): Promise<Streak | undefined> {
  return get<Streak>('ae:streak')
}

// --- Day Metrics ---

export async function saveDayMetrics(metrics: DayMetrics): Promise<void> {
  await set(`ae:metrics:${metrics.dayId}`, metrics)
}

export async function getDayMetrics(dayId: string): Promise<DayMetrics | undefined> {
  return get<DayMetrics>(`ae:metrics:${dayId}`)
}

export async function getDayMetricsRange(startDay: string, endDay: string): Promise<DayMetrics[]> {
  const allKeys = await keys<string>()
  const metricKeys = allKeys.filter((k) => {
    if (!k.startsWith('ae:metrics:')) return false
    const day = k.slice('ae:metrics:'.length)
    return day >= startDay && day <= endDay
  })
  const metrics = await Promise.all(metricKeys.map((k) => get<DayMetrics>(k)))
  return metrics.filter((m): m is DayMetrics => m !== undefined)
}

// --- Clear All ---

export async function clearAllData(): Promise<void> {
  await clear()
}

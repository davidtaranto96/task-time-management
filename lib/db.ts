import { get, set, del, keys, clear } from 'idb-keyval'
import type { Task } from '@/types/task'
import type { Habit, HabitCompletion } from '@/types/habit'
import type { Subtask } from '@/types/subtask'
import type { DailyPlan } from '@/types/task'
import type { ImpactSession, DayMetrics, Streak } from '@/types/dashboard'
import type { Project } from '@/types/project'
import type { WeeklyPlan, WeekDay } from '@/types/weekly'
import type { QuickNote } from '@/types/inbox'
import type { LifeEvent } from '@/types/lifeEvent'
import type { JournalEntry } from '@/types/journal'

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

// === Projects ===

export async function saveProject(project: Project): Promise<void> {
  await set(`ae:project:${project.id}`, project)
}

export async function getProject(id: string): Promise<Project | undefined> {
  return await get(`ae:project:${id}`)
}

export async function getAllProjects(): Promise<Project[]> {
  const allKeys = await keys()
  const projectKeys = allKeys.filter((k) => String(k).startsWith('ae:project:'))
  const projects = await Promise.all(projectKeys.map((k) => get(k)))
  return projects.filter(Boolean) as Project[]
}

export async function deleteProject(id: string): Promise<void> {
  await del(`ae:project:${id}`)
}

// === Weekly Plans ===

export async function saveWeeklyPlan(plan: WeeklyPlan): Promise<void> {
  await set(`ae:weekly:${plan.id}`, plan)
}

export async function getWeeklyPlan(weekId: string): Promise<WeeklyPlan | undefined> {
  return await get(`ae:weekly:${weekId}`)
}

export async function saveWeekDay(weekDay: WeekDay): Promise<void> {
  await set(`ae:weekday:${weekDay.weekId}:${weekDay.dayId}`, weekDay)
}

export async function getWeekDay(weekId: string, dayId: string): Promise<WeekDay | undefined> {
  return await get(`ae:weekday:${weekId}:${dayId}`)
}

// === Quick Notes (Inbox) ===

export async function saveQuickNote(note: QuickNote): Promise<void> {
  await set(`ae:note:${note.id}`, note)
}

export async function getQuickNote(id: string): Promise<QuickNote | undefined> {
  return await get(`ae:note:${id}`)
}

export async function getAllQuickNotes(): Promise<QuickNote[]> {
  const allKeys = await keys()
  const noteKeys = allKeys.filter((k) => String(k).startsWith('ae:note:'))
  const notes = await Promise.all(noteKeys.map((k) => get(k)))
  return notes.filter(Boolean) as QuickNote[]
}

export async function deleteQuickNote(id: string): Promise<void> {
  await del(`ae:note:${id}`)
}

// === Life Events ===

export async function saveLifeEvent(event: LifeEvent): Promise<void> {
  await set(`ae:event:${event.id}`, event)
}

export async function getLifeEvent(id: string): Promise<LifeEvent | undefined> {
  return await get(`ae:event:${id}`)
}

export async function getAllLifeEvents(): Promise<LifeEvent[]> {
  const allKeys = await keys()
  const eventKeys = allKeys.filter((k) => String(k).startsWith('ae:event:'))
  const events = await Promise.all(eventKeys.map((k) => get(k)))
  return events.filter(Boolean) as LifeEvent[]
}

export async function deleteLifeEvent(id: string): Promise<void> {
  await del(`ae:event:${id}`)
}

// === Journal ===

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  await set(`ae:journal:${entry.dayId}`, entry)
}

export async function getJournalEntry(dayId: string): Promise<JournalEntry | undefined> {
  return await get(`ae:journal:${dayId}`)
}

export async function getJournalEntries(dayIds: string[]): Promise<JournalEntry[]> {
  const entries = await Promise.all(dayIds.map((d) => get(`ae:journal:${d}`)))
  return entries.filter(Boolean) as JournalEntry[]
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const allKeys = await keys()
  const journalKeys = allKeys.filter((k) => String(k).startsWith('ae:journal:'))
  const entries = await Promise.all(journalKeys.map((k) => get(k)))
  return entries.filter(Boolean) as JournalEntry[]
}

// === Habits ===
export async function saveHabit(habit: Habit): Promise<void> {
  await set(`ae:habit:${habit.id}`, habit)
}
export async function getHabit(id: string): Promise<Habit | undefined> {
  return await get(`ae:habit:${id}`)
}
export async function getAllHabits(): Promise<Habit[]> {
  const allKeys = await keys()
  const habitKeys = allKeys.filter((k) => String(k).startsWith('ae:habit:'))
  const habits = await Promise.all(habitKeys.map((k) => get(k)))
  return habits.filter(Boolean) as Habit[]
}
export async function deleteHabit(id: string): Promise<void> {
  await del(`ae:habit:${id}`)
}

// === Habit Completions ===
export async function saveHabitCompletion(completion: HabitCompletion): Promise<void> {
  await set(`ae:habitcomp:${completion.habitId}:${completion.dayId}`, completion)
}
export async function getHabitCompletion(habitId: string, dayId: string): Promise<HabitCompletion | undefined> {
  return await get(`ae:habitcomp:${habitId}:${dayId}`)
}
export async function deleteHabitCompletion(habitId: string, dayId: string): Promise<void> {
  await del(`ae:habitcomp:${habitId}:${dayId}`)
}
export async function getAllHabitCompletions(): Promise<HabitCompletion[]> {
  const allKeys = await keys()
  const compKeys = allKeys.filter((k) => String(k).startsWith('ae:habitcomp:'))
  const completions = await Promise.all(compKeys.map((k) => get(k)))
  return completions.filter(Boolean) as HabitCompletion[]
}
export async function getHabitCompletionsByHabit(habitId: string): Promise<HabitCompletion[]> {
  const allKeys = await keys()
  const compKeys = allKeys.filter((k) => String(k).startsWith(`ae:habitcomp:${habitId}:`))
  const completions = await Promise.all(compKeys.map((k) => get(k)))
  return completions.filter(Boolean) as HabitCompletion[]
}

// === Subtasks ===
export async function saveSubtask(subtask: Subtask): Promise<void> {
  await set(`ae:subtask:${subtask.id}`, subtask)
}
export async function getSubtask(id: string): Promise<Subtask | undefined> {
  return await get(`ae:subtask:${id}`)
}
export async function getSubtasksByParent(parentTaskId: string): Promise<Subtask[]> {
  const allKeys = await keys()
  const subtaskKeys = allKeys.filter((k) => String(k).startsWith('ae:subtask:'))
  const subtasks = await Promise.all(subtaskKeys.map((k) => get(k)))
  return (subtasks.filter(Boolean) as Subtask[])
    .filter((s) => s.parentTaskId === parentTaskId)
    .sort((a, b) => a.order - b.order)
}
export async function deleteSubtask(id: string): Promise<void> {
  await del(`ae:subtask:${id}`)
}

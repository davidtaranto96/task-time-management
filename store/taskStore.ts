import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, DailyPlan, TaskZone, TaskPriority, DecisionType, TaskStatus, TaskAction } from '@/types/task'
import {
  saveTask,
  getTasksByDay,
  deleteTask as dbDeleteTask,
  saveDailyPlan,
  getDailyPlan,
} from '@/lib/db'
import { createTask, canMoveToSignal, DECISION_FATIGUE_THRESHOLD } from '@/lib/taskRules'
import { getTodayId } from '@/lib/dateUtils'
import { createIDBStorage } from '@/lib/persistence'

interface TaskStoreState {
  tasks: Record<string, Task>
  dailyPlan: DailyPlan | null
  todayId: string
  isLoaded: boolean

  loadToday: () => Promise<void>
  addTask: (partial: Partial<Task> & { title: string }) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  removeTask: (id: string) => Promise<void>

  completeTask: (id: string) => Promise<void>
  deferTask: (id: string, deferTo?: string) => Promise<void>
  delegateTask: (id: string, delegateTo: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>

  moveToSignal: (id: string) => Promise<{ success: boolean; reason?: string }>
  moveToNoise: (id: string) => Promise<void>
  setGoldenTask: (id: string) => Promise<void>

  setGoldenQuestion: (question: string) => Promise<void>

  getSignalTasks: () => Task[]
  getNoiseTasks: () => Task[]
  getActiveTasks: () => Task[]
  getGoldenTask: () => Task | null
  getSignalCount: () => number
  wouldTriggerFatigue: () => boolean
}

function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      tasks: {},
      dailyPlan: null,
      todayId: getTodayId(),
      isLoaded: false,

      loadToday: async () => {
        const todayId = getTodayId()
        const taskList = await getTasksByDay(todayId)
        const tasks: Record<string, Task> = {}
        for (const t of taskList) {
          tasks[t.id] = t
        }
        const dailyPlan = await getDailyPlan(todayId)
        set({ tasks, dailyPlan, todayId, isLoaded: true })
      },

      addTask: async (partial) => {
        const state = get()
        const task = createTask({ ...partial, dayId: state.todayId })
        await saveTask(task)
        set((s) => ({ tasks: { ...s.tasks, [task.id]: task } }))
        return task
      },

      updateTask: async (id, updates) => {
        const state = get()
        const existing = state.tasks[id]
        if (!existing) return
        const updated = { ...existing, ...updates }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
      },

      removeTask: async (id) => {
        await dbDeleteTask(id)
        set((s) => {
          const tasks = { ...s.tasks }
          delete tasks[id]
          return { tasks }
        })
      },

      completeTask: async (id) => {
        const state = get()
        const task = state.tasks[id]
        if (!task) return
        const updated: Task = {
          ...task,
          status: 'done' as TaskStatus,
          completedAt: new Date().toISOString(),
        }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
      },

      deferTask: async (id, deferTo) => {
        const state = get()
        const task = state.tasks[id]
        if (!task) return
        const updated: Task = {
          ...task,
          status: 'deferred' as TaskStatus,
          action: 'defer' as TaskAction,
          deferredTo: deferTo ?? getTomorrow(),
        }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
      },

      delegateTask: async (id, delegateTo) => {
        const state = get()
        const task = state.tasks[id]
        if (!task) return
        const updated: Task = {
          ...task,
          status: 'delegated' as TaskStatus,
          action: 'delegate' as TaskAction,
          delegatedTo: delegateTo,
        }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
      },

      deleteTask: async (id) => {
        const state = get()
        const task = state.tasks[id]
        if (!task) return
        const updated: Task = {
          ...task,
          status: 'deleted' as TaskStatus,
          action: 'delete' as TaskAction,
        }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
      },

      moveToSignal: async (id) => {
        const state = get()
        const task = state.tasks[id]
        if (!task) return { success: false, reason: 'Task not found' }
        const signalTasks = get().getSignalTasks()
        const result = canMoveToSignal(task, signalTasks)
        if (!result.success) return result
        const updated: Task = {
          ...task,
          zone: 'signal' as TaskZone,
          priority: 'primordial' as TaskPriority,
          decisionType: 'type1' as DecisionType,
        }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
        return { success: true }
      },

      moveToNoise: async (id) => {
        const state = get()
        const task = state.tasks[id]
        if (!task) return
        const updated: Task = {
          ...task,
          zone: 'noise' as TaskZone,
        }
        await saveTask(updated)
        set((s) => ({ tasks: { ...s.tasks, [id]: updated } }))
      },

      setGoldenTask: async (id) => {
        const state = get()
        const updates: Record<string, Task> = {}
        for (const [tid, task] of Object.entries(state.tasks)) {
          if (task.isGoldenTask && tid !== id) {
            const updated = { ...task, isGoldenTask: false }
            await saveTask(updated)
            updates[tid] = updated
          }
        }
        const target = state.tasks[id]
        if (target) {
          const updated = { ...target, isGoldenTask: true }
          await saveTask(updated)
          updates[id] = updated
        }
        set((s) => ({ tasks: { ...s.tasks, ...updates } }))
      },

      setGoldenQuestion: async (question) => {
        const state = get()
        const todayId = state.todayId
        const plan: DailyPlan = state.dailyPlan
          ? { ...state.dailyPlan, goldenQuestion: question }
          : { id: todayId, goldenQuestion: question, createdAt: new Date().toISOString() }
        await saveDailyPlan(plan)
        set({ dailyPlan: plan })
      },

      getSignalTasks: () => {
        const state = get()
        return Object.values(state.tasks).filter(
          (t) =>
            t.dayId === state.todayId &&
            t.zone === 'signal' &&
            t.status !== 'deleted' &&
            t.status !== 'delegated'
        )
      },

      getNoiseTasks: () => {
        const state = get()
        return Object.values(state.tasks).filter(
          (t) =>
            t.dayId === state.todayId &&
            t.zone === 'noise' &&
            t.status !== 'deleted'
        )
      },

      getActiveTasks: () => {
        const state = get()
        return Object.values(state.tasks).filter(
          (t) =>
            t.dayId === state.todayId &&
            t.status !== 'deleted' &&
            t.status !== 'deferred'
        )
      },

      getGoldenTask: () => {
        const state = get()
        return Object.values(state.tasks).find((t) => t.isGoldenTask) ?? null
      },

      getSignalCount: () => {
        return get().getSignalTasks().length
      },

      wouldTriggerFatigue: () => {
        return get().getSignalCount() >= DECISION_FATIGUE_THRESHOLD
      },
    }),
    {
      name: 'ae-tasks',
      storage: createIDBStorage(),
      partialize: (state) => ({
        tasks: state.tasks,
        dailyPlan: state.dailyPlan,
      }),
    }
  )
)

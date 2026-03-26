import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createIDBStorage } from '@/lib/persistence'
import { createTask } from '@/lib/taskRules'
import { getTodayId } from '@/lib/dateUtils'
import * as db from '@/lib/db'
import type { Task, TaskPriority, TaskAction } from '@/types'
import type { AreaKey } from '@/types/area'

interface TaskStoreState {
  tasks: Record<string, Task>
  dailyPlan: { dayId: string; tasks: string[]; createdAt: string } | null
  todayId: string
  isLoaded: boolean

  // Actions
  loadToday: () => Promise<void>
  addTask: (partial: Partial<Task> & { title: string }) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  removeTask: (id: string) => Promise<void>
  completeTask: (id: string) => Promise<void>
  uncompleteTask: (id: string) => Promise<void>
  deferTask: (id: string, deferTo?: string) => Promise<void>
  delegateTask: (id: string, delegateTo: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  scheduleTask: (id: string, date: string) => Promise<void>

  // Selectors
  getTodayPrimordial: () => Task[]
  getTodaySecondary: () => Task[]
  getActiveTasks: () => Task[]
  getPrimordialCount: () => number
  getTodayStats: () => { total: number; done: number; deferred: number; pending: number }
}

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      tasks: {} as Record<string, Task>,
      dailyPlan: null,
      todayId: getTodayId(),
      isLoaded: false,

      loadToday: async () => {
        const todayId = getTodayId()
        const dayTasks = await db.getTasksByDay(todayId)
        const tasksRecord: Record<string, Task> = {}
        for (const t of dayTasks) {
          tasksRecord[t.id] = t
        }
        const plan = await db.getDailyPlan(todayId)
        set({ tasks: tasksRecord, dailyPlan: plan || null, todayId, isLoaded: true })
      },

      addTask: async (partial) => {
        const { todayId } = get()
        const task = createTask({ ...partial, dayId: partial.dayId || todayId })
        await db.saveTask(task)
        set((state) => ({ tasks: { ...state.tasks, [task.id]: task } }))
        return task
      },

      updateTask: async (id, updates) => {
        const task = get().tasks[id]
        if (!task) return
        const updated = { ...task, ...updates }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      removeTask: async (id) => {
        await db.deleteTask(id)
        set((state) => {
          const { [id]: _, ...rest } = state.tasks
          return { tasks: rest }
        })
      },

      completeTask: async (id) => {
        const task = get().tasks[id]
        if (!task) return
        const updated = { ...task, status: 'done' as const, action: 'do' as const, completedAt: new Date().toISOString() }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      uncompleteTask: async (id) => {
        const task = get().tasks[id]
        if (!task) return
        const updated = { ...task, status: 'pending' as const, completedAt: undefined }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      deferTask: async (id, deferTo) => {
        const task = get().tasks[id]
        if (!task) return
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const year = tomorrow.getFullYear()
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
        const day = String(tomorrow.getDate()).padStart(2, '0')
        const tomorrowId = `${year}-${month}-${day}`
        const deferDate = deferTo || tomorrowId
        const updated = {
          ...task,
          status: 'pending' as const,
          action: 'defer' as const,
          deferredTo: deferDate,
          scheduledDate: deferDate,
          dayId: deferDate,
        }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      delegateTask: async (id, delegateTo) => {
        const task = get().tasks[id]
        if (!task) return
        const updated = { ...task, status: 'delegated' as const, action: 'delegate' as const, delegatedTo: delegateTo }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      deleteTask: async (id) => {
        const task = get().tasks[id]
        if (!task) return
        const updated = { ...task, status: 'deleted' as const, action: 'delete' as const }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      scheduleTask: async (id, date) => {
        const task = get().tasks[id]
        if (!task) return
        const updated = { ...task, scheduledDate: date, dayId: date }
        await db.saveTask(updated)
        set((state) => ({ tasks: { ...state.tasks, [id]: updated } }))
      },

      getTodayPrimordial: (): Task[] => {
        const { tasks, todayId } = get()
        return Object.values(tasks)
          .filter((t) => t.dayId === todayId && t.priority === 'primordial' && t.status !== 'deleted')
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      },

      getTodaySecondary: (): Task[] => {
        const { tasks, todayId } = get()
        return Object.values(tasks)
          .filter((t) => t.dayId === todayId && t.priority !== 'primordial' && t.status === 'pending')
          .sort((a, b) => {
            if (a.priority === 'importante' && b.priority !== 'importante') return -1
            if (b.priority === 'importante' && a.priority !== 'importante') return 1
            return a.createdAt.localeCompare(b.createdAt)
          })
      },

      getActiveTasks: (): Task[] => {
        const { tasks, todayId } = get()
        return Object.values(tasks).filter(
          (t) => t.dayId === todayId && t.status !== 'deleted' && t.status !== 'deferred' && t.status !== 'delegated'
        )
      },

      getPrimordialCount: (): number => {
        const { tasks, todayId } = get()
        return Object.values(tasks).filter(
          (t) => t.dayId === todayId && t.priority === 'primordial' && t.status !== 'deleted' && t.status !== 'done'
        ).length
      },

      getTodayStats: (): { total: number; done: number; deferred: number; pending: number } => {
        const { tasks, todayId } = get()
        const todayTasks = Object.values(tasks).filter(
          (t) => t.dayId === todayId && t.status !== 'deleted'
        )
        return {
          total: todayTasks.length,
          done: todayTasks.filter((t) => t.status === 'done').length,
          deferred: todayTasks.filter((t) => t.action === 'defer').length,
          pending: todayTasks.filter((t) => t.status === 'pending').length,
        }
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

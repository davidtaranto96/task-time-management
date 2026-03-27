import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/generateId'
import type { ImpactSession, DayMetrics, Streak } from '@/types/dashboard'
import type { Task } from '@/types/task'
import {
  saveImpactSession,
  getImpactSessionsByDay,
  saveStreak,
  getStreak,
  saveDayMetrics,
  getDayMetrics,
} from '@/lib/db'
import { getTodayId } from '@/lib/dateUtils'
import { createIDBStorage } from '@/lib/persistence'
import { sendDaySuccessNotification } from '@/lib/notifications'

interface DashboardStoreState {
  sessions: ImpactSession[]
  todayMetrics: DayMetrics | null
  streak: Streak | null
  isLoaded: boolean

  loadDashboard: () => Promise<void>
  addImpactSession: (session: Omit<ImpactSession, 'id'>) => Promise<void>
  computeAndSaveDayMetrics: (tasks: Task[]) => Promise<void>
  updateStreak: (metrics: DayMetrics) => Promise<void>
}

export const useDashboardStore = create<DashboardStoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      todayMetrics: null,
      streak: null,
      isLoaded: false,

      loadDashboard: async () => {
        const todayId = getTodayId()
        const sessions = await getImpactSessionsByDay(todayId)
        const todayMetrics = await getDayMetrics(todayId)
        const streak = await getStreak()
        set({ sessions, todayMetrics, streak, isLoaded: true })
      },

      addImpactSession: async (session) => {
        const full: ImpactSession = { ...session, id: generateId() }
        await saveImpactSession(full)
        set((s) => ({ sessions: [...s.sessions, full] }))
      },

      computeAndSaveDayMetrics: async (tasks) => {
        const todayId = getTodayId()
        const primordialTasks = tasks.filter((t) => t.priority === 'primordial')
        const primordialDone = primordialTasks.filter((t) => t.status === 'done')

        const { sessions } = get()
        const signalSessions = sessions.filter((s) => s.zone === 'signal')
        const highImpactHours = signalSessions.reduce(
          (acc, s) => acc + (s.durationMinutes ?? 0) / 60,
          0
        )

        const isSuccessful =
          primordialTasks.length === 0
            ? primordialDone.length >= 1 || tasks.filter((t) => t.status === 'done').length >= 1
            : primordialDone.length === primordialTasks.length

        const metrics: DayMetrics = {
          id: todayId,
          dayId: todayId,
          primordialTotal: primordialTasks.length,
          primordialDone: primordialDone.length,
          highImpactHours,
          isSuccessful,
          totalImpactSessions: sessions.length,
          createdAt: new Date().toISOString(),
        }

        await saveDayMetrics(metrics)
        set({ todayMetrics: metrics })
        await get().updateStreak(metrics)
      },

      updateStreak: async (metrics) => {
        const currentStreak = get().streak
        const wasSuccessful = currentStreak?.lastSuccessfulDay === metrics.dayId

        if (!metrics.isSuccessful) return

        const todayId = getTodayId()
        const yesterday = (() => {
          const d = new Date()
          d.setDate(d.getDate() - 1)
          return d.toISOString().slice(0, 10)
        })()

        const currentCount = currentStreak?.currentCount ?? 0
        const lastDay = currentStreak?.lastSuccessfulDay ?? null

        const isConsecutive = lastDay === yesterday || lastDay === todayId
        const newCount = lastDay === todayId ? currentCount : isConsecutive ? currentCount + 1 : 1
        const longestCount = Math.max(currentStreak?.longestCount ?? 0, newCount)

        const updatedStreak: Streak = {
          id: 'streak',
          currentCount: newCount,
          longestCount,
          lastSuccessfulDay: todayId,
          updatedAt: new Date().toISOString(),
        }

        await saveStreak(updatedStreak)
        set({ streak: updatedStreak })

        if (!wasSuccessful) {
          sendDaySuccessNotification()
        }
      },
    }),
    {
      name: 'ae-dashboard',
      storage: createIDBStorage(),
      partialize: (state) => ({
        todayMetrics: state.todayMetrics,
        streak: state.streak,
      }),
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveWeeklyPlan, getWeeklyPlan } from '@/lib/db'
import { createIDBStorage } from '@/lib/persistence'
import type { WeeklyPlan } from '@/types'

function getISOWeekNumber(date: Date): number {
  const tmp = new Date(date.getTime())
  tmp.setHours(0, 0, 0, 0)
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
  const week1 = new Date(tmp.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((tmp.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  )
}

function getWeekBounds(date: Date): { weekStart: string; weekEnd: string } {
  const day = date.getDay()
  const diffToMonday = (day === 0 ? -6 : 1 - day)
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  }
}

interface WeeklyStoreState {
  currentWeek: WeeklyPlan | null
  isLoaded: boolean

  loadWeek: (weekId?: string) => Promise<void>
  createWeekPlan: (weekId: string) => Promise<WeeklyPlan>
  updateGoals: (goals: Array<{text: string, done: boolean}>) => Promise<void>
  setProjectFocus: (projectIds: string[]) => Promise<void>
  setReflection: (text: string) => Promise<void>
  completeWeek: () => Promise<void>

  getCurrentWeekId: () => string
}

export const useWeeklyStore = create<WeeklyStoreState>()(
  persist(
    (setState, getState) => ({
      currentWeek: null,
      isLoaded: false,

      getCurrentWeekId: (): string => {
        const now = new Date()
        const year = now.getFullYear()
        const week = getISOWeekNumber(now)
        return `week-${year}-${String(week).padStart(2, '0')}`
      },

      loadWeek: async (weekId?: string) => {
        const state = getState()
        const targetId = weekId ?? state.getCurrentWeekId()
        let plan = await getWeeklyPlan(targetId)
        if (!plan) {
          plan = await state.createWeekPlan(targetId)
        }
        setState({ currentWeek: plan, isLoaded: true })
      },

      createWeekPlan: async (weekId: string) => {
        const parts = weekId.replace('week-', '').split('-')
        const year = parseInt(parts[0])
        const week = parseInt(parts[1])
        // Approximate date from ISO week
        const jan4 = new Date(year, 0, 4)
        const dayOfWeek = jan4.getDay() || 7
        const weekStart = new Date(jan4)
        weekStart.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
        const { weekEnd } = getWeekBounds(weekStart)

        const plan: WeeklyPlan = {
          id: weekId,
          weekStart: weekStart.toISOString().split('T')[0],
          weekEnd,
          primordialGoals: [],
          projectFocus: [],
          reflection: undefined,
          createdAt: new Date().toISOString(),
          isComplete: false,
        }
        await saveWeeklyPlan(plan)
        return plan
      },

      updateGoals: async (goals: Array<{text: string, done: boolean}>) => {
        const state = getState()
        if (!state.currentWeek) return
        const updated: WeeklyPlan = { ...state.currentWeek, primordialGoals: goals }
        await saveWeeklyPlan(updated)
        setState({ currentWeek: updated })
      },

      setProjectFocus: async (projectIds: string[]) => {
        const state = getState()
        if (!state.currentWeek) return
        const updated: WeeklyPlan = { ...state.currentWeek, projectFocus: projectIds }
        await saveWeeklyPlan(updated)
        setState({ currentWeek: updated })
      },

      setReflection: async (text: string) => {
        const state = getState()
        if (!state.currentWeek) return
        const updated: WeeklyPlan = { ...state.currentWeek, reflection: text }
        await saveWeeklyPlan(updated)
        setState({ currentWeek: updated })
      },

      completeWeek: async () => {
        const state = getState()
        if (!state.currentWeek) return
        const updated: WeeklyPlan = { ...state.currentWeek, isComplete: true }
        await saveWeeklyPlan(updated)
        setState({ currentWeek: updated })
      },
    }),
    {
      name: 'ae-weekly',
      storage: createIDBStorage(),
      partialize: (state) => ({ currentWeek: state.currentWeek }),
    }
  )
)

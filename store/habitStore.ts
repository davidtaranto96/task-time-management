import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from 'idb-keyval'
import { createIDBStorage } from '@/lib/persistence'
import type { Habit, HabitCompletion } from '@/types'

interface HabitStoreState {
  habits: Record<string, Habit>
  completions: HabitCompletion[]
  isLoaded: boolean

  loadHabits: () => Promise<void>
  addHabit: (partial: Partial<Habit> & { title: string }) => Promise<Habit>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  archiveHabit: (id: string) => Promise<void>
  toggleCompletion: (habitId: string, dayId: string) => Promise<void>

  getActiveHabits: () => Habit[]
  getHabitsForDay: (dayId: string) => Habit[]
  isCompletedToday: (habitId: string, dayId: string) => boolean
  getStreak: (habitId: string) => number
  getCompletionsForDay: (dayId: string) => HabitCompletion[]
}

export const useHabitStore = create<HabitStoreState>()(
  persist(
    (setState, getState) => ({
      habits: {} as Record<string, Habit>,
      completions: [] as HabitCompletion[],
      isLoaded: false,

      loadHabits: async () => {
        const allKeys = await idbKeys()
        const habitKeys = (allKeys as string[]).filter((k) => k.startsWith('ae:habit:'))
        const compKeys = (allKeys as string[]).filter((k) => k.startsWith('ae:habitcomp:'))

        const habitEntries = await Promise.all(
          habitKeys.map(async (k) => {
            const habit = await idbGet(k) as Habit
            return [habit.id, habit] as [string, Habit]
          })
        )

        const completions = await Promise.all(
          compKeys.map((k) => idbGet(k) as Promise<HabitCompletion>)
        )

        setState({
          habits: Object.fromEntries(habitEntries),
          completions: completions.filter(Boolean),
          isLoaded: true,
        })
      },

      addHabit: async (partial) => {
        const habit: Habit = {
          id: crypto.randomUUID(),
          title: partial.title,
          description: partial.description,
          frequency: partial.frequency ?? 'daily',
          area: partial.area,
          color: partial.color,
          icon: partial.icon,
          isArchived: false,
          createdAt: new Date().toISOString(),
        }
        await idbSet(`ae:habit:${habit.id}`, habit)
        setState((state) => ({
          habits: { ...state.habits, [habit.id]: habit },
        }))
        return habit
      },

      updateHabit: async (id, updates) => {
        const existing = getState().habits[id]
        if (!existing) return
        const updated = { ...existing, ...updates }
        await idbSet(`ae:habit:${id}`, updated)
        setState((s) => ({
          habits: { ...s.habits, [id]: updated },
        }))
      },

      archiveHabit: async (id) => {
        const existing = getState().habits[id]
        if (!existing) return
        const updated = { ...existing, isArchived: true }
        await idbSet(`ae:habit:${id}`, updated)
        setState((s) => ({
          habits: { ...s.habits, [id]: updated },
        }))
      },

      toggleCompletion: async (habitId, dayId) => {
        const key = `ae:habitcomp:${habitId}:${dayId}`
        const existing = getState().completions.find(
          (c) => c.habitId === habitId && c.dayId === dayId
        )

        if (existing) {
          await idbDel(key)
          setState((s) => ({
            completions: s.completions.filter(
              (c) => !(c.habitId === habitId && c.dayId === dayId)
            ),
          }))
        } else {
          const completion: HabitCompletion = {
            id: crypto.randomUUID(),
            habitId,
            dayId,
            completedAt: new Date().toISOString(),
          }
          await idbSet(key, completion)
          setState((s) => ({
            completions: [...s.completions, completion],
          }))
        }
      },

      getActiveHabits: (): Habit[] => {
        return Object.values(getState().habits).filter((h) => !h.isArchived)
      },

      getHabitsForDay: (dayId: string): Habit[] => {
        const state = getState()
        const active = Object.values(state.habits).filter((h) => !h.isArchived)
        return active.filter((habit) => {
          if (habit.frequency === 'daily') return true
          if (habit.frequency === 'weekly') {
            const weekPrefix = dayId.substring(0, 8)
            const completedThisWeek = state.completions.some(
              (c) => c.habitId === habit.id && c.dayId.startsWith(weekPrefix)
            )
            return !completedThisWeek
          }
          return true
        })
      },

      isCompletedToday: (habitId: string, dayId: string): boolean => {
        return getState().completions.some(
          (c) => c.habitId === habitId && c.dayId === dayId
        )
      },

      getStreak: (habitId: string): number => {
        const state = getState()
        const habit = state.habits[habitId]
        if (!habit) return 0

        const completionDays = state.completions
          .filter((c) => c.habitId === habitId)
          .map((c) => c.dayId)
          .sort()
          .reverse()

        if (completionDays.length === 0) return 0

        let streak = 0
        let current = new Date()
        current.setHours(0, 0, 0, 0)

        for (const day of completionDays) {
          const dayDate = new Date(day)
          dayDate.setHours(0, 0, 0, 0)
          const diffDays = Math.round(
            (current.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (diffDays <= 1) {
            streak++
            current = dayDate
          } else {
            break
          }
        }

        return streak
      },

      getCompletionsForDay: (dayId: string): HabitCompletion[] => {
        return getState().completions.filter((c) => c.dayId === dayId)
      },
    }),
    {
      name: 'ae-habits',
      storage: createIDBStorage(),
      partialize: (state) => ({ habits: state.habits }),
    }
  )
)

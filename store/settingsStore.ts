import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimerMode } from '@/types/timer'
import type { AreaKey } from '@/types/area'
import { createIDBStorage } from '@/lib/persistence'

interface SettingsStoreState {
  preferredTimerMode: TimerMode
  notificationsEnabled: boolean
  workStartHour: number
  workEndHour: number
  defaultArea?: AreaKey

  setPreferredTimerMode: (mode: TimerMode) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setWorkHours: (start: number, end: number) => void
  setDefaultArea: (area: AreaKey | undefined) => void
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      preferredTimerMode: 'pomodoro_50' as TimerMode,
      notificationsEnabled: true,
      workStartHour: 9,
      workEndHour: 18,
      defaultArea: undefined,

      setPreferredTimerMode: (mode) =>
        set({ preferredTimerMode: mode }),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      setWorkHours: (start, end) =>
        set({ workStartHour: start, workEndHour: end }),

      setDefaultArea: (area) =>
        set({ defaultArea: area }),
    }),
    {
      name: 'ae-settings',
      storage: createIDBStorage(),
    }
  )
)

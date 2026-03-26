import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimerMode } from '@/types/timer'
import { createIDBStorage } from '@/lib/persistence'

interface SettingsStoreState {
  ceroRuidoEnabled: boolean
  ceoFocusMode: boolean
  preferredTimerMode: TimerMode
  notificationsEnabled: boolean
  workStartHour: number
  workEndHour: number

  toggleCeroRuido: () => void
  toggleCeoFocus: () => void
  setPreferredTimerMode: (mode: TimerMode) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setWorkHours: (start: number, end: number) => void
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      ceroRuidoEnabled: false,
      ceoFocusMode: false,
      preferredTimerMode: 'pomodoro_50' as TimerMode,
      notificationsEnabled: true,
      workStartHour: 9,
      workEndHour: 18,

      toggleCeroRuido: () =>
        set((s) => ({ ceroRuidoEnabled: !s.ceroRuidoEnabled })),

      toggleCeoFocus: () =>
        set((s) => ({ ceoFocusMode: !s.ceoFocusMode })),

      setPreferredTimerMode: (mode) =>
        set({ preferredTimerMode: mode }),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      setWorkHours: (start, end) =>
        set({ workStartHour: start, workEndHour: end }),
    }),
    {
      name: 'ae-settings',
      storage: createIDBStorage(),
    }
  )
)

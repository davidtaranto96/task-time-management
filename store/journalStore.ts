import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveJournalEntry, getJournalEntry, getAllJournalEntries, deleteJournalEntry } from '@/lib/db'
import { createIDBStorage } from '@/lib/persistence'
import type { JournalEntry } from '@/types'

function getTodayDayId(): string {
  return new Date().toISOString().split('T')[0]
}

interface JournalStoreState {
  todayEntry: JournalEntry | null
  isLoaded: boolean

  loadEntry: (dayId?: string) => Promise<void>
  saveEntry: (updates: Partial<JournalEntry>) => Promise<void>
  getEntry: (dayId: string) => Promise<JournalEntry | null>
  getAllEntries: () => Promise<JournalEntry[]>
  deleteEntry: (dayId: string) => Promise<void>
}

export const useJournalStore = create<JournalStoreState>()(
  persist(
    (setState, getState) => ({
      todayEntry: null,
      isLoaded: false,

      loadEntry: async (dayId?: string) => {
        const targetDayId = dayId ?? getTodayDayId()
        let entry = await getJournalEntry(targetDayId)
        if (!entry) {
          entry = {
            id: crypto.randomUUID(),
            dayId: targetDayId,
            reflection: '',
            mood: undefined,
            gratitude: undefined,
            lessonsLearned: undefined,
            tomorrowFocus: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          await saveJournalEntry(entry)
        }
        setState({ todayEntry: entry, isLoaded: true })
      },

      saveEntry: async (updates: Partial<JournalEntry>) => {
        const state = getState()
        if (!state.todayEntry) return
        const updated: JournalEntry = {
          ...state.todayEntry,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        await saveJournalEntry(updated)
        setState({ todayEntry: updated })
      },

      getEntry: async (dayId: string) => {
        return (await getJournalEntry(dayId)) ?? null
      },

      getAllEntries: async () => {
        const entries = await getAllJournalEntries()
        return entries.sort((a, b) => b.dayId.localeCompare(a.dayId))
      },

      deleteEntry: async (dayId: string) => {
        await deleteJournalEntry(dayId)
        const state = getState()
        if (state.todayEntry?.dayId === dayId) {
          setState({ todayEntry: null })
        }
      },
    }),
    {
      name: 'ae-journal',
      storage: createIDBStorage(),
      partialize: (state) => ({ todayEntry: state.todayEntry }),
    }
  )
)

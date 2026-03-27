import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveQuickNote, getQuickNote, getAllQuickNotes, deleteQuickNote } from '@/lib/db'
import { createIDBStorage } from '@/lib/persistence'
import { generateId } from '@/lib/generateId'
import type { QuickNote, QuickNoteType } from '@/types'

interface InboxStoreState {
  notes: Record<string, QuickNote>
  isLoaded: boolean

  loadNotes: () => Promise<void>
  addNote: (content: string, type?: QuickNoteType) => Promise<QuickNote>
  updateNote: (id: string, updates: Partial<QuickNote>) => Promise<void>
  processNote: (
    id: string,
    processedTo: { type: 'task' | 'project' | 'event' | 'note'; targetId: string }
  ) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  getUnprocessed: () => QuickNote[]
  getProcessed: () => QuickNote[]
  getUnprocessedCount: () => number
}

export const useInboxStore = create<InboxStoreState>()(
  persist(
    (setState, getState) => ({
      notes: {} as Record<string, QuickNote>,
      isLoaded: false,

      loadNotes: async () => {
        const allNotes = await getAllQuickNotes()
        const notesMap: Record<string, QuickNote> = {}
        for (const note of allNotes) {
          notesMap[note.id] = note
        }
        setState({ notes: notesMap, isLoaded: true })
      },

      addNote: async (content, type = 'general') => {
        const note: QuickNote = {
          id: generateId(),
          content,
          type,
          isProcessed: false,
          createdAt: new Date().toISOString(),
        }
        await saveQuickNote(note)
        setState((state: InboxStoreState) => ({
          notes: { ...state.notes, [note.id]: note },
        }))
        return note
      },

      updateNote: async (id, updates) => {
        const state = getState()
        const existing = state.notes[id]
        if (!existing) return
        const updated: QuickNote = { ...existing, ...updates }
        await saveQuickNote(updated)
        setState((s: InboxStoreState) => ({
          notes: { ...s.notes, [id]: updated },
        }))
      },

      processNote: async (id, processedTo) => {
        const state = getState()
        const existing = state.notes[id]
        if (!existing) return
        const updated: QuickNote = {
          ...existing,
          isProcessed: true,
          processedTo,
        }
        await saveQuickNote(updated)
        setState((s: InboxStoreState) => ({
          notes: { ...s.notes, [id]: updated },
        }))
      },

      deleteNote: async (id) => {
        await deleteQuickNote(id)
        setState((state: InboxStoreState) => {
          const notes = { ...state.notes }
          delete notes[id]
          return { notes }
        })
      },

      getUnprocessed: (): QuickNote[] => {
        const state = getState()
        return Object.values(state.notes)
          .filter((n) => !n.isProcessed)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      },

      getProcessed: (): QuickNote[] => {
        const state = getState()
        return Object.values(state.notes).filter((n) => n.isProcessed)
      },

      getUnprocessedCount: (): number => {
        const state = getState()
        return Object.values(state.notes).filter((n) => !n.isProcessed).length
      },
    }),
    {
      name: 'ae-inbox',
      storage: createIDBStorage(),
      partialize: (state) => ({ notes: state.notes }),
    }
  )
)

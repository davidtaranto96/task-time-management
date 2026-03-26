import { get, set, del } from 'idb-keyval'
import { createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get<string>(`ae:store:${name}`)
    return value ?? null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(`ae:store:${name}`, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(`ae:store:${name}`)
  },
}

export function createIDBStorage() {
  return createJSONStorage(() => idbStorage)
}

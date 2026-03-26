export type QuickNoteType = "idea" | "task" | "reminder" | "contact" | "general"

export interface QuickNote {
  id: string
  content: string             // the raw note text
  type: QuickNoteType
  isProcessed: boolean        // has user classified/moved it?
  processedTo?: {             // where did this note become?
    type: "task" | "project" | "event"
    targetId: string          // task ID, project ID, or event ID
  }
  createdAt: string           // ISO date string
  tags?: string[]             // optional user tags
}

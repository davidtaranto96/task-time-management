"use client"

import type { QuickNote, QuickNoteType } from "@/types"

interface NoteItemProps {
  note: QuickNote
  onProcess: (noteId: string) => void
  onDelete: (noteId: string) => void
}

const TYPE_ICONS: Record<QuickNoteType, string> = {
  idea: "💡",
  task: "✅",
  reminder: "🔔",
  contact: "👤",
  general: "📝",
}

const TYPE_LABELS: Record<QuickNoteType, string> = {
  idea: "Idea",
  task: "Tarea",
  reminder: "Recordatorio",
  contact: "Contacto",
  general: "General",
}

function formatRelativeTime(isoString: string): string {
  const now = new Date()
  const then = new Date(isoString)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMin < 1) return "ahora"
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHours < 24) {
    const hours = then.getHours().toString().padStart(2, "0")
    const mins = then.getMinutes().toString().padStart(2, "0")
    return `hoy ${hours}:${mins}`
  }
  return then.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export function NoteItem({ note, onProcess, onDelete }: NoteItemProps) {
  return (
    <div className="rounded-lg bg-ae-surface border-l-2 border-ae-info px-4 py-3 flex flex-col gap-2">
      <p className="text-ae-text text-sm leading-relaxed whitespace-pre-wrap break-words">
        {note.content}
      </p>
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-ae-surface-2 px-2 py-0.5 text-xs text-ae-text-muted">
            {TYPE_ICONS[note.type]} {TYPE_LABELS[note.type]}
          </span>
          <span className="text-xs text-ae-text-muted">
            {formatRelativeTime(note.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onProcess(note.id)}
            className="text-xs font-medium text-ae-primordial hover:opacity-80 transition-opacity"
          >
            Procesar →
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-xs text-ae-text-muted hover:text-ae-danger transition-colors leading-none"
            aria-label="Eliminar nota"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

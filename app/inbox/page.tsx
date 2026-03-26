"use client"

import { useEffect, useState } from "react"
import { useInboxStore } from "@/store/inboxStore"
import { useTaskStore } from "@/store/taskStore"
import { useProjectStore } from "@/store/projectStore"
import { CaptureInput } from "@/components/inbox/CaptureInput"
import { NoteItem } from "@/components/inbox/NoteItem"
import { ProcessSheet } from "@/components/inbox/ProcessSheet"
import { getTodayId } from "@/lib/dateUtils"
import type { QuickNote } from "@/types"
import type { TaskPriority } from "@/types"
import type { AreaKey } from "@/types/area"

export default function InboxPage() {
  const { loadNotes, addNote, processNote, deleteNote, getUnprocessed, getProcessed, isLoaded } =
    useInboxStore()
  const { addTask } = useTaskStore()
  const { addProject } = useProjectStore()

  const [selectedNote, setSelectedNote] = useState<QuickNote | null>(null)
  const [processedExpanded, setProcessedExpanded] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const unprocessed = getUnprocessed().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const processed = getProcessed().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleCapture = async (content: string) => {
    await addNote(content)
  }

  const handleProcess = (noteId: string) => {
    const note = useInboxStore.getState().notes[noteId]
    if (note) setSelectedNote(note)
  }

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId)
  }

  const handleCreateTask = async (title: string, priority: TaskPriority, area?: AreaKey) => {
    if (!selectedNote) return
    const task = await addTask({ title, priority, area, dayId: getTodayId() })
    await processNote(selectedNote.id, { type: "task", targetId: task.id })
    setSelectedNote(null)
  }

  const handleCreateProject = async (title: string) => {
    if (!selectedNote) return
    const project = await addProject({ title })
    await processNote(selectedNote.id, { type: "project", targetId: project.id })
    setSelectedNote(null)
  }

  const handleDismiss = async (noteId: string) => {
    await deleteNote(noteId)
    setSelectedNote(null)
  }

  const processedLabel = (note: QuickNote) => {
    if (!note.processedTo) return "Descartado"
    if (note.processedTo.type === "task") return "→ Tarea"
    if (note.processedTo.type === "project") return "→ Proyecto"
    if (note.processedTo.type === "event") return "→ Evento"
    return "Procesado"
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ae-text">📥 Inbox</h1>
          {unprocessed.length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-ae-primordial/20 px-2.5 py-0.5 text-xs font-bold text-ae-primordial">
              {unprocessed.length}
            </span>
          )}
        </div>
        <p className="text-sm text-ae-text-muted">
          Anotá lo que quieras. Después decidís qué hacer.
        </p>
      </div>

      {/* Capture input */}
      <CaptureInput onCapture={handleCapture} />

      {/* Empty state */}
      {isLoaded && unprocessed.length === 0 && processed.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-4xl">📥</span>
          <p className="text-lg font-semibold text-ae-text">Tu inbox está vacío</p>
          <p className="text-sm text-ae-text-muted max-w-xs">
            Cuando algo se te cruce por la cabeza, anotalo acá.
          </p>
        </div>
      ) : (
        <>
          {/* Unprocessed notes */}
          {unprocessed.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider">
                  Sin procesar
                </h2>
                <span className="inline-flex items-center justify-center rounded-full bg-ae-surface-2 px-2 py-0.5 text-xs text-ae-text-muted">
                  {unprocessed.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {unprocessed.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onProcess={handleProcess}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Processed notes (collapsible) */}
          {processed.length > 0 && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setProcessedExpanded((v) => !v)}
                className="flex items-center gap-2 text-left"
              >
                <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider">
                  Procesados
                </h2>
                <span className="inline-flex items-center justify-center rounded-full bg-ae-surface-2 px-2 py-0.5 text-xs text-ae-text-muted">
                  {processed.length}
                </span>
                <span className="ml-auto text-xs text-ae-text-muted">
                  {processedExpanded ? "▲" : "▼"}
                </span>
              </button>

              {processedExpanded && (
                <div className="flex flex-col gap-2">
                  {processed.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg bg-ae-surface border-l-2 border-ae-border px-4 py-3 flex flex-col gap-1 opacity-60"
                    >
                      <p className="text-sm text-ae-text line-clamp-2">{note.content}</p>
                      <span className="text-xs text-ae-success">{processedLabel(note)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Process Sheet */}
      <ProcessSheet
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onCreateTask={handleCreateTask}
        onCreateProject={handleCreateProject}
        onDismiss={handleDismiss}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import { AREAS } from "@/types/area"
import type { AreaKey } from "@/types/area"
import type { QuickNote } from "@/types"
import type { TaskPriority } from "@/types"

interface ProcessSheetProps {
  note: QuickNote | null
  onClose: () => void
  onCreateTask: (title: string, priority: TaskPriority, area?: AreaKey) => void
  onCreateProject: (title: string) => void
  onDismiss: (noteId: string) => void
}

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: "primordial", label: "Primordial", color: "text-ae-primordial border-ae-primordial" },
  { value: "importante", label: "Importante", color: "text-ae-info border-ae-info" },
  { value: "puede_esperar", label: "Puede esperar", color: "text-ae-text-muted border-ae-border" },
]

type Mode = null | "task" | "project"

export function ProcessSheet({ note, onClose, onCreateTask, onCreateProject, onDismiss }: ProcessSheetProps) {
  const [mode, setMode] = useState<Mode>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("importante")
  const [taskArea, setTaskArea] = useState<AreaKey | undefined>(undefined)
  const [projectTitle, setProjectTitle] = useState("")

  if (!note) return null

  const openMode = (m: Mode) => {
    setMode(m)
    if (m === "task") setTaskTitle(note.content)
    if (m === "project") setProjectTitle(note.content)
  }

  const handleClose = () => {
    setMode(null)
    setTaskTitle("")
    setTaskPriority("importante")
    setTaskArea(undefined)
    setProjectTitle("")
    onClose()
  }

  const handleCreateTask = () => {
    const t = taskTitle.trim()
    if (!t) return
    onCreateTask(t, taskPriority, taskArea)
    handleClose()
  }

  const handleCreateProject = () => {
    const t = projectTitle.trim()
    if (!t) return
    onCreateProject(t)
    handleClose()
  }

  const handleDismiss = () => {
    onDismiss(note.id)
    handleClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-ae-surface rounded-t-2xl p-6 flex flex-col gap-5 z-10 mx-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-ae-text">¿Qué hacemos con esto?</h2>

        {/* Note preview */}
        <blockquote className="border-l-2 border-ae-border pl-3 text-sm text-ae-text-muted italic">
          {note.content}
        </blockquote>

        {/* Options */}
        <div className="flex flex-col gap-3">

          {/* Create Task */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openMode(mode === "task" ? null : "task")}
              className="w-full rounded-xl bg-ae-primordial/10 border border-ae-primordial/30 px-4 py-3 text-left text-sm font-semibold text-ae-primordial hover:bg-ae-primordial/20 transition-colors"
            >
              ✅ Crear tarea
            </button>
            {mode === "task" && (
              <div className="flex flex-col gap-3 pl-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Título de la tarea..."
                  className="w-full rounded-lg bg-ae-surface-2 border border-ae-border px-3 py-2 text-sm text-ae-text placeholder:text-ae-text-muted focus:outline-none focus:ring-2 focus:ring-ae-primordial/50"
                />
                {/* Priority */}
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setTaskPriority(p.value)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                        taskPriority === p.value
                          ? p.color + " bg-ae-surface-2"
                          : "border-ae-border text-ae-text-muted hover:border-ae-text-muted"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {/* Areas */}
                <div className="flex flex-wrap gap-2">
                  {(Object.values(AREAS)).map((area) => (
                    <button
                      key={area.key}
                      onClick={() => setTaskArea(taskArea === area.key ? undefined : area.key)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        taskArea === area.key
                          ? "bg-ae-surface-2 border-transparent"
                          : "border-ae-border text-ae-text-muted hover:border-ae-text-muted"
                      }`}
                      style={taskArea === area.key ? { color: area.color, borderColor: area.color } : {}}
                    >
                      {area.icon} {area.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCreateTask}
                  disabled={!taskTitle.trim()}
                  className="self-end rounded-lg bg-ae-primordial px-4 py-2 text-sm font-semibold text-ae-bg disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  Crear
                </button>
              </div>
            )}
          </div>

          {/* Create Project */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openMode(mode === "project" ? null : "project")}
              className="w-full rounded-xl bg-ae-info/10 border border-ae-info/30 px-4 py-3 text-left text-sm font-semibold text-ae-info hover:bg-ae-info/20 transition-colors"
            >
              🚀 Crear proyecto
            </button>
            {mode === "project" && (
              <div className="flex flex-col gap-3 pl-2">
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Nombre del proyecto..."
                  className="w-full rounded-lg bg-ae-surface-2 border border-ae-border px-3 py-2 text-sm text-ae-text placeholder:text-ae-text-muted focus:outline-none focus:ring-2 focus:ring-ae-info/50"
                />
                <button
                  onClick={handleCreateProject}
                  disabled={!projectTitle.trim()}
                  className="self-end rounded-lg bg-ae-info px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  Crear
                </button>
              </div>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="w-full rounded-xl bg-ae-surface-2 border border-ae-border px-4 py-3 text-left text-sm font-semibold text-ae-text-muted hover:text-ae-danger hover:border-ae-danger/40 transition-colors"
          >
            🗑️ Descartar
          </button>
        </div>

        {/* Cancel */}
        <button
          onClick={handleClose}
          className="self-center text-sm text-ae-text-muted hover:text-ae-text transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

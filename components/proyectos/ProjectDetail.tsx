"use client"

import { useState, useRef, useEffect } from 'react'
import type { Project, Task, ProjectCategory } from '@/types'

const CATEGORY_LABELS: Record<ProjectCategory, { name: string; icon: string; color: string }> = {
  professional: { name: 'Profesional', icon: '💼', color: '#3b82f6' },
  personal: { name: 'Personal', icon: '🏠', color: '#8b5cf6' },
  health: { name: 'Salud', icon: '🏥', color: '#10b981' },
  learning: { name: 'Aprendizaje', icon: '📚', color: '#f59e0b' },
  travel: { name: 'Viajes', icon: '✈️', color: '#06b6d4' },
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  primordial: { label: 'Primordial', color: '#f59e0b' },
  importante: { label: 'Importante', color: '#3b82f6' },
  puede_esperar: { label: 'Puede esperar', color: '#6b7280' },
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: 'Activo', color: '#10b981' },
  paused: { label: 'Pausado', color: '#f59e0b' },
  archived: { label: 'Archivado', color: '#6b7280' },
  completed: { label: 'Completado', color: '#10b981' },
}

interface ProjectDetailProps {
  project: Project
  tasks: Task[]
  onClose: () => void
  onAddTask: (title: string, priority: 'primordial' | 'importante' | 'puede_esperar', dayId?: string) => void
  onToggleTask: (taskId: string) => void
  onUpdateProject: (updates: Partial<Project>) => void
  onArchive: () => void
  onComplete: () => void
  onReopen?: () => void
}

export default function ProjectDetail({
  project,
  tasks,
  onClose,
  onAddTask,
  onToggleTask,
  onUpdateProject,
  onArchive,
  onComplete,
  onReopen,
}: ProjectDetailProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'primordial' | 'importante' | 'puede_esperar'>('puede_esperar')
  const [newTaskDayId, setNewTaskDayId] = useState('')
  const [notes, setNotes] = useState(project.notes ?? '')
  const [editingDesc, setEditingDesc] = useState(false)
  const [descValue, setDescValue] = useState(project.description ?? '')
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const addTaskRef = useRef<HTMLInputElement>(null)

  const category = CATEGORY_LABELS[project.category]
  const badge = STATUS_BADGE[project.status]

  const doneTasks = tasks.filter((t) => t.status === 'done')
  const pendingTasks = tasks.filter((t) => t.status !== 'done')
  const progress = tasks.length > 0 ? (doneTasks.length / tasks.length) * 100 : 0

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    onAddTask(newTaskTitle.trim(), newTaskPriority, newTaskDayId || undefined)
    setNewTaskTitle('')
    setNewTaskPriority('puede_esperar')
    setNewTaskDayId('')
    addTaskRef.current?.focus()
  }

  const handleNotesChange = (val: string) => {
    setNotes(val)
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      onUpdateProject({ notes: val })
    }, 800)
  }

  const handleDescSave = () => {
    setEditingDesc(false)
    onUpdateProject({ description: descValue.trim() || undefined })
  }

  useEffect(() => {
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current)
    }
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-3xl shrink-0">{project.icon ?? project.title.charAt(0).toUpperCase()}</span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-ae-text leading-tight">{project.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: badge.color + '22', color: badge.color }}
              >
                {badge.label}
              </span>
              <span
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: category.color + '22', color: category.color }}
              >
                {category.icon} {category.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description (editable) */}
      <div>
        {editingDesc ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={handleDescSave}
              onKeyDown={(e) => e.key === 'Enter' && handleDescSave()}
              className="flex-1 bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-1.5 text-ae-text text-sm focus:outline-none focus:border-ae-primordial"
            />
          </div>
        ) : (
          <button
            onClick={() => setEditingDesc(true)}
            className="text-sm text-ae-text-muted hover:text-ae-text transition-colors text-left w-full"
          >
            {project.description ?? (
              <span className="italic opacity-50">+ Agregar descripción...</span>
            )}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-ae-text">Progreso</span>
          <span className="text-sm text-ae-text-muted">
            {doneTasks.length}/{tasks.length} tareas · {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2.5 bg-ae-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div>
        <h3 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-2">Tareas</h3>

        {/* Pending tasks */}
        <div className="space-y-1">
          {pendingTasks.length === 0 && doneTasks.length === 0 && (
            <p className="text-sm text-ae-text-muted italic py-2">Sin tareas aún.</p>
          )}
          {pendingTasks.map((task) => {
            const prio = PRIORITY_LABELS[task.priority] ?? PRIORITY_LABELS['puede_esperar']
            return (
              <div
                key={task.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-ae-surface-2 group"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="w-4 h-4 rounded border border-ae-border flex items-center justify-center shrink-0 hover:border-ae-success transition-colors"
                />
                <span className="flex-1 text-sm text-ae-text">{task.title}</span>
                {task.dayId && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0 bg-ae-surface-2 text-ae-text-muted">
                    {task.dayId}
                  </span>
                )}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: prio.color + '22', color: prio.color }}
                >
                  {prio.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Completed tasks */}
        {doneTasks.length > 0 && (
          <div className="mt-3 space-y-1 opacity-40">
            <p className="text-xs text-ae-text-muted mb-1">Completadas</p>
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="w-4 h-4 rounded border border-ae-success bg-ae-success flex items-center justify-center shrink-0"
                >
                  <svg className="w-2.5 h-2.5 text-ae-bg" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="flex-1 text-sm text-ae-text line-through">{task.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add task input */}
        <form onSubmit={handleAddTask} className="mt-3 space-y-2">
          <div className="flex gap-2">
            <input
              ref={addTaskRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="+ Agregar tarea..."
              className="flex-1 bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-1.5 text-sm text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="px-3 py-1.5 bg-ae-primordial text-ae-bg text-sm font-semibold rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['primordial', 'importante', 'puede_esperar'] as const).map((p) => {
              const info = PRIORITY_LABELS[p]
              const isSelected = newTaskPriority === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewTaskPriority(p)}
                  className="text-xs px-2 py-0.5 rounded-full font-medium border transition-all"
                  style={{
                    backgroundColor: isSelected ? info.color + '33' : 'transparent',
                    borderColor: isSelected ? info.color : '#2a2a35',
                    color: isSelected ? info.color : '#71717a',
                  }}
                >
                  {info.label}
                </button>
              )
            })}
            <input
              type="date"
              lang="es"
              value={newTaskDayId}
              onChange={(e) => setNewTaskDayId(e.target.value)}
              className="bg-ae-surface-2 border border-ae-border rounded-lg px-2 py-0.5 text-xs text-ae-text focus:outline-none focus:border-ae-primordial"
            />
          </div>
        </form>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-2">Notas</h3>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Notas libres sobre el proyecto..."
          rows={3}
          className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial text-sm resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-ae-border">
        {project.status === 'completed' && onReopen && (
          <button
            onClick={() => { onReopen(); onClose() }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-lg hover:bg-amber-500/30 transition-colors"
          >
            ↩ Reabrir proyecto
          </button>
        )}
        {project.status !== 'completed' && (
          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ae-success/20 text-ae-success text-sm font-medium rounded-lg hover:bg-ae-success/30 transition-colors"
          >
            ✓ Completar proyecto
          </button>
        )}
        {project.status !== 'archived' && (
          <button
            onClick={onArchive}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ae-surface-2 text-ae-text-muted text-sm font-medium rounded-lg hover:text-ae-text transition-colors border border-ae-border"
          >
            📦 Archivar
          </button>
        )}
        <button
          onClick={onClose}
          className="ml-auto text-sm text-ae-text-muted hover:text-ae-text transition-colors underline underline-offset-2"
        >
          ← Volver
        </button>
      </div>
    </div>
  )
}

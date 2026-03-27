"use client"

import { useState, useRef } from 'react'
import { saveTask, deleteTask as dbDeleteTask } from '@/lib/db'
import { generateId } from '@/lib/generateId'
import type { Task, TaskPriority } from '@/types/task'

interface DayDetailProps {
  dayId: string
  tasks: Task[]
  onTasksChange: (updatedTasks: Record<string, Task>) => void
}

const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string; activeColor: string }[] = [
  { value: 'primordial', label: 'Primordial', color: 'text-ae-text-muted border-ae-border', activeColor: 'text-ae-primordial bg-ae-primordial/10 border-ae-primordial/50' },
  { value: 'importante', label: 'Importante', color: 'text-ae-text-muted border-ae-border', activeColor: 'text-ae-info bg-ae-info/10 border-ae-info/50' },
  { value: 'puede_esperar', label: 'Puede esperar', color: 'text-ae-text-muted border-ae-border', activeColor: 'text-ae-text-muted bg-ae-surface-2 border-ae-text-muted/30' },
]

const PRIORITY_BADGES: Record<string, { label: string; color: string }> = {
  primordial: { label: 'Primordial', color: 'text-ae-primordial bg-ae-primordial/10 border-ae-primordial/30' },
  importante: { label: 'Importante', color: 'text-ae-info bg-ae-info/10 border-ae-info/30' },
  puede_esperar: { label: 'Puede esperar', color: 'text-ae-text-muted bg-ae-surface-2 border-ae-border' },
}

export default function DayDetail({ dayId, tasks, onTasksChange }: DayDetailProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('importante')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const date = new Date(dayId + 'T00:00:00')
  const dayName = DAY_NAMES_FULL[date.getDay()]
  const dateStr = `${date.getDate()} ${MONTHS[date.getMonth()]}`

  const activeTasks = tasks.filter((t) => t.status !== 'deleted')

  const handleAddTask = async () => {
    const title = newTaskTitle.trim()
    if (!title) return
    const newTask: Task = {
      id: generateId(),
      title,
      priority: newTaskPriority,
      status: 'pending',
      dayId,
      createdAt: new Date().toISOString(),
    }
    await saveTask(newTask)
    const updated: Record<string, Task> = {}
    for (const t of tasks) updated[t.id] = t
    updated[newTask.id] = newTask
    onTasksChange(updated)
    setNewTaskTitle('')
    inputRef.current?.focus()
  }

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done'
    const updated: Task = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
    }
    await saveTask(updated)
    const map: Record<string, Task> = {}
    for (const t of tasks) map[t.id] = t
    map[updated.id] = updated
    onTasksChange(map)
  }

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const handleSaveEdit = async (task: Task) => {
    const trimmed = editingTitle.trim()
    if (!trimmed || trimmed === task.title) {
      setEditingId(null)
      return
    }
    const updated: Task = { ...task, title: trimmed }
    await saveTask(updated)
    const map: Record<string, Task> = {}
    for (const t of tasks) map[t.id] = t
    map[updated.id] = updated
    onTasksChange(map)
    setEditingId(null)
  }

  const handleDelete = async (task: Task) => {
    setDeletingId(task.id)
    await dbDeleteTask(task.id)
    // Small delay for visual feedback
    setTimeout(() => {
      const map: Record<string, Task> = {}
      for (const t of tasks) {
        if (t.id !== task.id) map[t.id] = t
      }
      onTasksChange(map)
      setDeletingId(null)
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask()
  }

  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider">
          {dayName}
        </h2>
        <span className="text-xs text-ae-text-muted">{dateStr}</span>
      </div>

      <div className="bg-ae-surface rounded-xl border border-ae-border p-4">
        {activeTasks.length === 0 ? (
          <p className="text-center text-ae-text-muted text-sm py-4">Sin tareas para este día</p>
        ) : (
          <ul className="flex flex-col gap-2 mb-4">
            {activeTasks.map((task) => {
              const pInfo = PRIORITY_BADGES[task.priority] ?? PRIORITY_BADGES.puede_esperar
              const isDone = task.status === 'done'
              const isDeleting = deletingId === task.id
              const isEditing = editingId === task.id

              return (
                <li
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg bg-ae-surface-2 border border-ae-border transition-all ${
                    isDone ? 'opacity-50' : ''
                  } ${isDeleting ? 'opacity-20 scale-95' : ''}`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-ae-success border-ae-success text-black'
                        : 'border-ae-border hover:border-ae-success'
                    }`}
                  >
                    {isDone && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Title (editable) */}
                  {isEditing ? (
                    <input
                      autoFocus
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(task)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(task)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="flex-1 bg-ae-bg border border-ae-primordial rounded px-2 py-1 text-sm text-ae-text focus:outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => handleStartEdit(task)}
                      className={`flex-1 text-sm cursor-pointer hover:text-ae-primordial transition-colors ${
                        isDone ? 'line-through text-ae-text-muted' : 'text-ae-text'
                      }`}
                    >
                      {task.title}
                    </span>
                  )}

                  {/* Priority badge */}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${pInfo.color}`}>
                    {pInfo.label}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(task)}
                    className="flex-shrink-0 p-1 rounded text-ae-text-muted hover:text-ae-danger hover:bg-ae-danger/10 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {/* Add task input */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="+ Agregar tarea..."
              className="flex-1 bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-sm text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial transition-colors"
            />
            <button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="px-3 py-2 rounded-lg bg-ae-primordial text-black text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ae-primordial/90 transition-colors"
            >
              +
            </button>
          </div>

          {/* Priority selector */}
          <div className="flex gap-1.5">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setNewTaskPriority(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  newTaskPriority === opt.value ? opt.activeColor : opt.color
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getTodayId } from '@/lib/dateUtils'
import type { Task } from '@/types/task'

interface DayDetailProps {
  dayId: string
  tasks: Task[]
  onClose: () => void
  onAddTask: (title: string) => void
}

const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  primordial: { label: 'Primordial', color: 'text-ae-primordial bg-ae-primordial/10 border-ae-primordial/30' },
  importante: { label: 'Importante', color: 'text-ae-info bg-ae-info/10 border-ae-info/30' },
  puede_esperar: { label: 'Puede esperar', color: 'text-ae-text-muted bg-ae-surface-2 border-ae-border' },
}

export default function DayDetail({ dayId, tasks, onClose, onAddTask }: DayDetailProps) {
  const router = useRouter()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const todayId = getTodayId()
  const isToday = dayId === todayId

  const date = new Date(dayId + 'T00:00:00')
  const dayName = DAY_NAMES_FULL[date.getDay()]
  const dateStr = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`

  const activeTasks = tasks.filter((t) => t.status !== 'deleted')

  const handleAddTask = () => {
    const title = newTaskTitle.trim()
    if (!title) return
    onAddTask(title)
    setNewTaskTitle('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask()
    if (e.key === 'Escape') onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-ae-surface border-t border-ae-border rounded-t-2xl max-h-[80vh] flex flex-col sm:max-w-lg sm:mx-auto sm:rounded-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ae-border flex-shrink-0">
          <div>
            <h2 className="font-bold text-ae-text text-lg">
              {dayName}
              {isToday && (
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-ae-primordial/20 text-ae-primordial border border-ae-primordial/30">
                  Hoy
                </span>
              )}
            </h2>
            <p className="text-sm text-ae-text-muted">{dateStr}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-ae-text-muted hover:text-ae-text hover:bg-ae-surface-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
          {activeTasks.length === 0 ? (
            <p className="text-center text-ae-text-muted text-sm py-6">Sin tareas para este día</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activeTasks.map((task) => {
                const pInfo = PRIORITY_LABELS[task.priority] ?? PRIORITY_LABELS.puede_esperar
                const isDone = task.status === 'done'
                return (
                  <li
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg bg-ae-surface-2 border border-ae-border transition-opacity ${isDone ? 'opacity-50' : ''}`}
                  >
                    <span className={`text-ae-success text-base ${isDone ? 'opacity-100' : 'opacity-0'}`}>✓</span>
                    <span className={`flex-1 text-sm ${isDone ? 'line-through text-ae-text-muted' : 'text-ae-text'}`}>
                      {task.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pInfo.color}`}>
                      {pInfo.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Add task input */}
        <div className="px-5 py-3 border-t border-ae-border flex-shrink-0">
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

          {isToday && (
            <button
              onClick={() => router.push('/hoy')}
              className="mt-2 w-full text-center text-sm text-ae-info hover:text-ae-info/80 transition-colors py-1"
            >
              Ir a este día →
            </button>
          )}
        </div>
      </div>
    </>
  )
}

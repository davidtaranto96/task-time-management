"use client"

import { useState } from 'react'
import { AREAS } from '@/types/area'
import type { Task, TaskPriority } from '@/types/task'

const PRIORITY_OPTS: { value: TaskPriority; label: string; dot: string }[] = [
  { value: 'primordial',    label: 'Primordial',    dot: 'bg-amber-400' },
  { value: 'importante',   label: 'Importante',    dot: 'bg-blue-400' },
  { value: 'puede_esperar',label: 'Puede esperar', dot: 'bg-ae-text-muted' },
  { value: 'secundaria',   label: '🎮 Side Quest', dot: 'bg-purple-400' },
]

interface SecondaryTaskItemProps {
  task: Task
  onComplete: () => void
  onDefer: () => void
  onPromote: () => void
  onEdit: (id: string, changes: { title?: string; priority?: TaskPriority }) => void
  onDelete: (id: string) => void
}

export default function SecondaryTaskItem({ task, onComplete, onDefer, onPromote, onEdit, onDelete }: SecondaryTaskItemProps) {
  const isDone = task.status === 'done'
  const area = task.area ? AREAS[task.area] : null
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority)

  function openEdit() {
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditing(true)
  }

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onEdit(task.id, { title: trimmed, priority: editPriority })
    setEditing(false)
  }

  const dotColor = PRIORITY_OPTS.find(o => o.value === task.priority)?.dot ?? 'bg-ae-text-muted'

  return (
    <>
      <div className="group flex items-center gap-3 rounded-xl px-3 py-2 border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-150" style={{backdropFilter:'blur(16px)'}}>
        {/* Checkbox */}
        <button
          onClick={onComplete}
          disabled={isDone}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isDone
              ? 'bg-ae-success border-ae-success text-white'
              : 'border-ae-border hover:border-ae-primordial'
          }`}
          title="Completar"
        >
          {isDone && <span className="text-xs">✓</span>}
        </button>

        {/* Priority dot */}
        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${dotColor}`} />

        {/* Title + date */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className={`text-sm truncate ${isDone ? 'line-through text-ae-text-muted' : 'text-ae-text'}`}>
            {task.title}
          </span>
          {task.scheduledDate && (
            <span className="text-xs text-ae-text-muted">
              {new Date(task.scheduledDate + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {/* Area badge */}
        {area && (
          <span
            className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: area.color + '22', color: area.color }}
          >
            {area.icon}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={openEdit}
            className="p-1 rounded text-ae-text-muted hover:text-ae-text hover:bg-ae-surface transition-colors active:scale-95 text-xs"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={onPromote}
            className="p-1 rounded text-ae-primordial hover:bg-ae-primordial/10 transition-colors active:scale-95 text-xs font-bold"
            title="Promover a primordial"
          >
            ↑
          </button>
          <button
            onClick={onDefer}
            className="p-1 rounded text-ae-text-muted hover:bg-ae-surface transition-colors active:scale-95 text-xs"
            title="Diferir para mañana"
          >
            →
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded text-red-400 hover:bg-red-400/10 transition-colors active:scale-95 text-xs"
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setEditing(false)}>
          <div
            className="w-full max-w-md rounded-t-2xl border border-white/[0.08] p-5 flex flex-col gap-4"
            style={{background:'rgba(14,14,18,0.85)',backdropFilter:'blur(32px) saturate(180%)',WebkitBackdropFilter:'blur(32px) saturate(180%)'}}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-semibold text-ae-text">Editar tarea</h3>

            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              autoFocus
              className="w-full rounded-xl bg-ae-surface-2 border border-ae-border px-4 py-3 text-ae-text text-sm focus:outline-none focus:ring-2 focus:ring-ae-primordial/60"
            />

            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEditPriority(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    editPriority === opt.value
                      ? 'border-ae-primordial text-ae-primordial bg-ae-primordial/10'
                      : 'border-ae-border text-ae-text-muted bg-ae-surface-2'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                disabled={!editTitle.trim()}
                className="flex-1 rounded-xl bg-ae-primordial py-3 text-sm font-bold text-black disabled:opacity-40"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl bg-ae-surface-2 border border-ae-border py-3 text-sm text-ae-text-muted"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

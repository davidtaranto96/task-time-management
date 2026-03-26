"use client"

import { useState } from "react"
import type { Task } from "@/types/task"

interface TaskCardProps {
  task: Task
  onDo: () => void
  onDelegate: (to: string) => void
  onDefer: (date?: string) => void
  onDelete: () => void
}

export default function TaskCard({ task, onDo, onDelegate, onDefer, onDelete }: TaskCardProps) {
  const [delegateOpen, setDelegateOpen] = useState(false)
  const [delegateName, setDelegateName] = useState("")
  const [deferOpen, setDeferOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleDelegate = () => {
    if (!delegateName.trim()) return
    onDelegate(delegateName.trim())
    setDelegateOpen(false)
    setDelegateName("")
  }

  const handleDeferTomorrow = () => {
    onDefer()
    setDeferOpen(false)
  }

  const handleDelete = () => {
    onDelete()
    setDeleteConfirm(false)
  }

  const statusBadge = () => {
    switch (task.status) {
      case "done":
        return <span className="text-xs text-ae-success font-medium">✓ Hecho</span>
      case "delegated":
        return (
          <span className="text-xs text-ae-success font-medium">
            → Delegado a {task.delegatedTo}
          </span>
        )
      case "deferred":
        return <span className="text-xs text-ae-accent font-medium">⏳ Pospuesto</span>
      case "deleted":
        return <span className="text-xs text-ae-danger font-medium">🗑 Eliminado</span>
      default:
        return null
    }
  }

  return (
    <div className="bg-ae-surface border border-ae-border rounded-xl p-4 flex flex-col gap-3">
      {/* Title + zone badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="font-bold text-ae-text text-sm leading-snug break-words">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-ae-text-muted leading-relaxed">{task.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {task.zone === "signal" ? (
            <span className="text-xs font-semibold text-ae-signal bg-ae-signal/10 border border-ae-signal/20 px-2 py-0.5 rounded-full">
              ⚡ Señal
            </span>
          ) : (
            <span className="text-xs font-semibold text-ae-noise bg-ae-surface-2 border border-ae-border px-2 py-0.5 rounded-full">
              📭 Ruido
            </span>
          )}
          {statusBadge()}
        </div>
      </div>

      {/* 4D Action buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          {/* Do */}
          <button
            onClick={onDo}
            className="flex-1 min-w-[80px] bg-ae-signal/90 hover:bg-ae-signal text-ae-bg font-semibold text-xs px-3 py-2 rounded-lg transition-all active:scale-95"
          >
            ✓ Hacer
          </button>

          {/* Delegate */}
          <button
            onClick={() => { setDelegateOpen(!delegateOpen); setDeferOpen(false); setDeleteConfirm(false) }}
            className={`flex-1 min-w-[80px] font-semibold text-xs px-3 py-2 rounded-lg transition-all active:scale-95 border ${
              delegateOpen
                ? "bg-ae-success/20 border-ae-success text-ae-success"
                : "bg-ae-success/10 border-ae-success/30 text-ae-success hover:bg-ae-success/20"
            }`}
          >
            👥 Delegar
          </button>

          {/* Defer */}
          <button
            onClick={() => { setDeferOpen(!deferOpen); setDelegateOpen(false); setDeleteConfirm(false) }}
            className={`flex-1 min-w-[80px] font-semibold text-xs px-3 py-2 rounded-lg transition-all active:scale-95 border ${
              deferOpen
                ? "bg-ae-accent/20 border-ae-accent text-ae-accent"
                : "bg-ae-accent/10 border-ae-accent/30 text-ae-accent hover:bg-ae-accent/20"
            }`}
          >
            ⏳ Patear
          </button>

          {/* Delete */}
          <button
            onClick={() => { setDeleteConfirm(!deleteConfirm); setDelegateOpen(false); setDeferOpen(false) }}
            className={`flex-1 min-w-[80px] font-semibold text-xs px-3 py-2 rounded-lg transition-all active:scale-95 border ${
              deleteConfirm
                ? "bg-ae-danger/20 border-ae-danger text-ae-danger"
                : "bg-transparent border-ae-danger/30 text-ae-danger hover:bg-ae-danger/10"
            }`}
          >
            🗑 Eliminar
          </button>
        </div>

        {/* Delegate inline input */}
        {delegateOpen && (
          <div className="flex gap-2 items-center bg-ae-surface-2 border border-ae-border rounded-lg p-2">
            <input
              type="text"
              placeholder="¿A quién?"
              value={delegateName}
              onChange={(e) => setDelegateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDelegate()}
              className="flex-1 bg-transparent text-xs text-ae-text placeholder:text-ae-text-muted outline-none min-w-0"
              autoFocus
            />
            <button
              onClick={handleDelegate}
              disabled={!delegateName.trim()}
              className="bg-ae-success/90 hover:bg-ae-success disabled:opacity-40 text-ae-bg font-semibold text-xs px-3 py-1.5 rounded-md transition-all active:scale-95"
            >
              Confirmar
            </button>
            <button
              onClick={() => setDelegateOpen(false)}
              className="text-ae-text-muted hover:text-ae-text text-xs px-2 py-1.5 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Defer inline options */}
        {deferOpen && (
          <div className="flex gap-2 items-center bg-ae-surface-2 border border-ae-border rounded-lg p-2">
            <button
              onClick={handleDeferTomorrow}
              className="flex-1 bg-ae-accent/90 hover:bg-ae-accent text-white font-semibold text-xs px-3 py-1.5 rounded-md transition-all active:scale-95"
            >
              Patear a mañana ➜
            </button>
            <div className="relative">
              <input
                type="date"
                onChange={(e) => { if (e.target.value) { onDefer(e.target.value); setDeferOpen(false) } }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              />
              <button className="border border-ae-accent/40 text-ae-accent text-xs px-3 py-1.5 rounded-md hover:bg-ae-accent/10 transition-colors pointer-events-none">
                Elegir fecha
              </button>
            </div>
            <button
              onClick={() => setDeferOpen(false)}
              className="text-ae-text-muted hover:text-ae-text text-xs px-2 py-1.5 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteConfirm && (
          <div className="flex gap-2 items-center bg-ae-danger/5 border border-ae-danger/20 rounded-lg p-2">
            <span className="text-xs text-ae-danger flex-1">¿Seguro?</span>
            <button
              onClick={handleDelete}
              className="bg-ae-danger/90 hover:bg-ae-danger text-white font-semibold text-xs px-3 py-1.5 rounded-md transition-all active:scale-95"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="text-ae-text-muted hover:text-ae-text text-xs px-2 py-1.5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

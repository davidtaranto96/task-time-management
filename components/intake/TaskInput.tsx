"use client"

import { useState } from "react"

interface TaskInputProps {
  onAdd: (title: string) => void
  disabled?: boolean
}

export default function TaskInput({ onAdd, disabled = false }: TaskInputProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (!trimmed || disabled) return
    onAdd(trimmed)
    setTitle("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Qué necesitas hacer?"
          disabled={disabled}
          className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-4 py-3 text-ae-text placeholder:text-ae-text-muted focus:outline-none focus:ring-2 focus:ring-ae-signal/50 focus:border-ae-signal/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
        />
        {disabled && (
          <div className="absolute inset-0 rounded-lg cursor-not-allowed" title="Agrega la pregunta de enfoque primero" />
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={disabled || !title.trim()}
        title={disabled ? "Confirma tu pregunta de enfoque antes de agregar tareas" : "Agregar tarea"}
        className="flex-shrink-0 bg-ae-surface-2 border border-ae-border text-ae-text-muted hover:text-ae-signal hover:border-ae-signal/50 font-medium text-sm px-4 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
      >
        ＋ Agregar tarea
      </button>
    </div>
  )
}

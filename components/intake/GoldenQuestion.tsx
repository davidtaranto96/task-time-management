"use client"

import { useState } from "react"

interface GoldenQuestionProps {
  answer: string
  onChange: (v: string) => void
  onConfirm: () => void
  isConfirmed: boolean
}

export default function GoldenQuestion({
  answer,
  onChange,
  onConfirm,
  isConfirmed,
}: GoldenQuestionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleConfirm = () => {
    if (!answer.trim()) return
    onConfirm()
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  if (isConfirmed && !isEditing) {
    return (
      <div className="bg-ae-surface border border-ae-signal/30 rounded-xl p-5 flex items-start gap-4 shadow-lg shadow-ae-signal/10">
        <div className="text-ae-signal text-2xl flex-shrink-0 mt-0.5">🎯</div>
        <div className="flex-1 min-w-0">
          <p className="text-ae-text-muted text-xs font-semibold uppercase tracking-widest mb-1">
            Tu enfoque de hoy
          </p>
          <p className="text-ae-text text-base font-medium leading-snug break-words">
            {answer}
          </p>
        </div>
        <button
          onClick={handleEdit}
          className="flex-shrink-0 text-ae-text-muted hover:text-ae-signal transition-colors p-1 rounded-md hover:bg-ae-surface-2"
          title="Editar enfoque"
          aria-label="Editar enfoque"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z"
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-ae-surface border border-ae-signal/30 rounded-xl p-6 shadow-lg shadow-ae-signal/10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-ae-signal text-xl">✦</span>
        <h2 className="text-ae-signal font-bold text-sm uppercase tracking-widest">
          La Pregunta Única
        </h2>
      </div>
      <p className="text-ae-text text-lg font-medium leading-relaxed mb-6">
        "¿Cuál es la única cosa que, si la haces hoy, hará que todo lo demás sea más fácil o innecesario?"
      </p>
      <textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Mi única cosa hoy es..."
        rows={3}
        className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-4 py-3 text-ae-text placeholder:text-ae-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-ae-signal/50 focus:border-ae-signal/50 transition-all text-sm"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleConfirm}
          disabled={!answer.trim()}
          className="bg-ae-signal text-ae-bg font-bold text-sm px-6 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all active:scale-95"
        >
          Confirmar mi enfoque
        </button>
      </div>
    </div>
  )
}

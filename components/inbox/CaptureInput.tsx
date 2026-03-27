"use client"

import { useRef, useState } from "react"
import type { QuickNoteType } from "@/types"

const TYPE_BUTTONS: { type: QuickNoteType; icon: string; label: string }[] = [
  { type: "idea", icon: "💡", label: "Idea" },
  { type: "nota", icon: "📝", label: "Nota" },
  { type: "tarea", icon: "✅", label: "Tarea" },
  { type: "proyecto", icon: "🚀", label: "Proyecto" },
]

interface CaptureInputProps {
  onCapture: (content: string, type: QuickNoteType) => void
}

export function CaptureInput({ onCapture }: CaptureInputProps) {
  const [value, setValue] = useState("")
  const [selectedType, setSelectedType] = useState<QuickNoteType>("general")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // No autofocus on mount — user should tap manually to avoid keyboard pop on navigation

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    autoResize()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onCapture(trimmed, selectedType)
    setValue("")
    setSelectedType("general")
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.focus()
      }
    }, 0)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Type selector */}
      <div className="flex items-center gap-2">
        {TYPE_BUTTONS.map((btn) => (
          <button
            key={btn.type}
            onClick={() => setSelectedType(selectedType === btn.type ? "general" : btn.type)}
            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedType === btn.type
                ? "bg-ae-primordial/15 border-ae-primordial/40 text-ae-primordial"
                : "bg-ae-surface-2 border-ae-border text-ae-text-muted hover:border-ae-text-muted"
            }`}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Anotá lo que tengas en mente..."
        rows={3}
        className="w-full resize-none rounded-xl bg-ae-surface-2 border border-ae-border p-4 text-ae-text placeholder:text-ae-text-muted focus:outline-none focus:ring-2 focus:ring-ae-primordial/60 transition-all"
        style={{ minHeight: "80px" }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-ae-text-muted">Ctrl+Enter para capturar</span>
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="rounded-lg bg-ae-primordial px-4 py-2 text-sm font-semibold text-ae-bg transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          Capturar
        </button>
      </div>
    </div>
  )
}

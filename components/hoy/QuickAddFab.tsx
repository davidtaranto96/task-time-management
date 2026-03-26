"use client"

import { useState, useRef, useEffect } from 'react'
import type { TaskPriority } from '@/types/task'

interface QuickAddFabProps {
  onAdd: (title: string, priority?: TaskPriority) => void
  defaultPriority?: TaskPriority
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'primordial', label: 'Primordial', color: 'text-ae-primordial border-ae-primordial/40 bg-ae-primordial/10' },
  { value: 'importante', label: 'Importante', color: 'text-ae-info border-ae-info/40 bg-ae-info/10' },
  { value: 'puede_esperar', label: 'Puede esperar', color: 'text-ae-text-muted border-ae-border bg-ae-surface-2' },
]

export default function QuickAddFab({ onAdd, defaultPriority = 'puede_esperar', open, onOpenChange }: QuickAddFabProps) {
  const [expanded, setExpanded] = useState(false)

  // Sync with external `open` prop
  useEffect(() => {
    if (open !== undefined && open !== expanded) {
      setExpanded(open)
    }
  }, [open])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>(defaultPriority)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update priority when defaultPriority prop changes
  useEffect(() => {
    if (!expanded) {
      setPriority(defaultPriority)
    }
  }, [defaultPriority, expanded])

  // Focus input when expanded
  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus()
    }
  }, [expanded])

  // Collapse on click outside
  useEffect(() => {
    if (!expanded) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false)
        setTitle('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expanded])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), priority)
    setTitle('')
    setExpanded(false)
    onOpenChange?.(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setExpanded(false)
      setTitle('')
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2"
    >
      {/* Expanded form */}
      {expanded && (
        <div className="bg-ae-surface border border-ae-border rounded-2xl shadow-2xl p-4 w-80 flex flex-col gap-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="¿Qué necesitás hacer?"
              className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-sm text-ae-text placeholder:text-ae-text-muted focus:outline-none focus:border-ae-primordial/60 transition-colors"
            />

            {/* Priority pills */}
            <div className="flex gap-2 flex-wrap">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${opt.color} ${
                    priority === opt.value ? 'ring-2 ring-offset-1 ring-offset-ae-surface ring-current' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full bg-ae-primordial text-black font-semibold py-2 rounded-lg text-sm hover:bg-ae-primordial/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agregar tarea
            </button>
          </form>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`w-12 h-12 rounded-full bg-ae-primordial text-black shadow-lg hover:bg-ae-primordial/90 transition-all flex items-center justify-center text-xl font-light ${
          expanded ? 'rotate-45' : 'rotate-0'
        } transition-transform duration-200`}
        title="Agregar tarea"
        aria-label="Agregar tarea"
      >
        +
      </button>
    </div>
  )
}

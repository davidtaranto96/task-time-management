'use client'

import { useState } from 'react'
import { AREAS, type AreaKey } from '@/types/area'

const ICONS = ['🏃', '📚', '💧', '🧘', '✍️', '💰', '🌙', '🍎', '🎯', '🏋️', '🧹', '🛌']

interface HabitFormProps {
  onSave: (data: {
    title: string
    frequency: 'daily' | 'weekly'
    area?: AreaKey
    icon?: string
  }) => void
  onCancel: () => void
}

export default function HabitForm({ onSave, onCancel }: HabitFormProps) {
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [area, setArea] = useState<AreaKey | undefined>()
  const [icon, setIcon] = useState<string | undefined>()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título es requerido')
      return
    }
    onSave({ title: title.trim(), frequency, area, icon })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ae-text">Nombre del hábito</label>
        <input
          autoFocus
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError('') }}
          placeholder="Ej: Leer 20 minutos"
          className="rounded-lg border border-ae-border bg-ae-surface-2 px-3 py-2.5 text-ae-text placeholder:text-ae-text-muted/50 focus:border-ae-primordial focus:outline-none"
        />
        {error && <p className="text-xs text-ae-danger">{error}</p>}
      </div>

      {/* Frequency */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ae-text">Frecuencia</label>
        <div className="flex gap-2">
          {(['daily', 'weekly'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                frequency === f
                  ? f === 'daily'
                    ? 'bg-ae-success/20 text-ae-success ring-1 ring-ae-success/40'
                    : 'bg-ae-info/20 text-ae-info ring-1 ring-ae-info/40'
                  : 'bg-ae-surface-2 text-ae-text-muted hover:text-ae-text'
              }`}
            >
              {f === 'daily' ? 'Diario' : 'Semanal'}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ae-text">Área (opcional)</label>
        <div className="flex flex-wrap gap-2">
          {(Object.values(AREAS)).map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setArea(area === a.key ? undefined : a.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors`}
              style={
                area === a.key
                  ? { backgroundColor: `${a.color}33`, color: a.color, outline: `1px solid ${a.color}66` }
                  : { backgroundColor: 'var(--ae-surface-2)', color: 'var(--ae-text-muted)' }
              }
            >
              {a.icon} {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Icon */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ae-text">Ícono (opcional)</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setIcon(icon === em ? undefined : em)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors ${
                icon === em
                  ? 'bg-ae-primordial/20 ring-1 ring-ae-primordial/50'
                  : 'bg-ae-surface-2 hover:bg-ae-border/30'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-ae-primordial px-4 py-2.5 font-semibold text-ae-bg transition-opacity hover:opacity-90"
        >
          Crear hábito
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-ae-surface-2 px-4 py-2.5 font-medium text-ae-text-muted hover:text-ae-text"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

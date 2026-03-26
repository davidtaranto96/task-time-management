"use client"

import { useState } from 'react'
import type { Project, ProjectCategory } from '@/types'

const CATEGORY_LABELS: Record<ProjectCategory, { name: string; icon: string; color: string }> = {
  professional: { name: 'Profesional', icon: '💼', color: '#3b82f6' },
  personal: { name: 'Personal', icon: '🏠', color: '#8b5cf6' },
  health: { name: 'Salud', icon: '🏥', color: '#10b981' },
  learning: { name: 'Aprendizaje', icon: '📚', color: '#f59e0b' },
  travel: { name: 'Viajes', icon: '✈️', color: '#06b6d4' },
}

const PRESET_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

interface ProjectFormProps {
  project?: Project
  onSave: (data: Partial<Project> & { title: string }) => void
  onCancel: () => void
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? 'personal')
  const [color, setColor] = useState(project?.color ?? '#3b82f6')
  const [targetDate, setTargetDate] = useState(
    project?.targetDate ? project.targetDate.slice(0, 10) : ''
  )
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    try {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        color,
        targetDate: targetDate || undefined,
      })
    } catch {
      setError('Error al guardar el proyecto')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-ae-text-muted mb-1">
          Nombre del proyecto <span className="text-ae-danger">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setError('') }}
          placeholder="Ej: Lanzar newsletter"
          required
          className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial text-sm"
        />
        {error && <p className="text-ae-danger text-xs mt-1">{error}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-ae-text-muted mb-1">
          Descripción <span className="text-ae-text-muted text-xs">(opcional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿De qué trata este proyecto?"
          rows={2}
          className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-ae-text placeholder-ae-text-muted focus:outline-none focus:border-ae-primordial text-sm resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-ae-text-muted mb-2">Categoría</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CATEGORY_LABELS) as [ProjectCategory, { name: string; icon: string; color: string }][]).map(
            ([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium border transition-all"
                style={{
                  backgroundColor: category === key ? val.color + '33' : 'transparent',
                  borderColor: category === key ? val.color : '#2a2a35',
                  color: category === key ? val.color : '#71717a',
                }}
              >
                <span>{val.icon}</span>
                <span>{val.name}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-sm font-medium text-ae-text-muted mb-2">Color</label>
        <div className="flex gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: color === c ? '#f4f4f5' : 'transparent',
                transform: color === c ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Target date */}
      <div>
        <label className="block text-sm font-medium text-ae-text-muted mb-1">
          Fecha objetivo <span className="text-ae-text-muted text-xs">(opcional)</span>
        </label>
        <input
          type="date"
          lang="es"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          placeholder="dd/mm/aaaa"
          className="w-full bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2 text-ae-text focus:outline-none focus:border-ae-primordial text-sm"
        />
        <p className="text-xs text-ae-muted mt-1">Formato: día/mes/año</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-ae-primordial text-ae-bg font-semibold py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-ae-surface-2 text-ae-text-muted font-medium py-2 rounded-lg text-sm hover:text-ae-text transition-colors border border-ae-border"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

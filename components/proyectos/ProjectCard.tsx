"use client"

import type { Project, ProjectCategory } from '@/types'

const CATEGORY_LABELS: Record<ProjectCategory, { name: string; icon: string; color: string }> = {
  professional: { name: 'Profesional', icon: '💼', color: '#3b82f6' },
  personal: { name: 'Personal', icon: '🏠', color: '#8b5cf6' },
  health: { name: 'Salud', icon: '🏥', color: '#10b981' },
  learning: { name: 'Aprendizaje', icon: '📚', color: '#f59e0b' },
  travel: { name: 'Viajes', icon: '✈️', color: '#06b6d4' },
}

interface ProjectCardProps {
  project: Project
  tasksCompleted: number
  tasksTotal: number
  onClick: () => void
}

export default function ProjectCard({ project, tasksCompleted, tasksTotal, onClick }: ProjectCardProps) {
  const category = CATEGORY_LABELS[project.category]
  const progress = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const statusBadge: Record<string, { label: string; color: string }> = {
    paused: { label: 'Pausado', color: '#f59e0b' },
    archived: { label: 'Archivado', color: '#6b7280' },
    completed: { label: 'Completado', color: '#10b981' },
  }

  const badge = statusBadge[project.status]

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-ae-surface rounded-xl p-4 hover:bg-ae-surface-2 transition-colors border border-ae-border relative overflow-hidden"
      style={{ borderLeft: `4px solid ${project.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{project.icon ?? project.title.charAt(0).toUpperCase()}</span>
          <span className="font-semibold text-ae-text truncate">{project.title}</span>
        </div>
        {badge && (
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
            style={{ backgroundColor: badge.color + '22', color: badge.color }}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Category badge */}
      <div className="mb-3">
        <span
          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: category.color + '22', color: category.color }}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </span>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-ae-text-muted">{tasksCompleted}/{tasksTotal} tareas</span>
          <span className="text-xs text-ae-text-muted">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-ae-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Target date */}
      {project.targetDate && (
        <p className="text-xs text-ae-text-muted mt-2">
          📅 Fecha: {formatDate(project.targetDate)}
        </p>
      )}
    </button>
  )
}

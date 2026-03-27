"use client"

import { useEffect, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import type { Project } from '@/types'
import ProjectCard from '@/components/proyectos/ProjectCard'
import ProjectForm from '@/components/proyectos/ProjectForm'
import ProjectDetail from '@/components/proyectos/ProjectDetail'

export default function ProyectosPage() {
  const {
    projects,
    loadProjects,
    addProject,
    updateProject,
    archiveProject,
    completeProject,
    reopenProject,
    unarchiveProject,
    addTaskToProject,
    isLoaded,
  } = useProjectStore()

  const { tasks, loadToday, addTask, updateTask } = useTaskStore()

  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [pausedOpen, setPausedOpen] = useState(false)
  const [completedOpen, setCompletedOpen] = useState(false)
  const [archivedOpen, setArchivedOpen] = useState(false)

  useEffect(() => {
    if (!isLoaded) loadProjects()
    loadToday()
  }, [isLoaded, loadProjects, loadToday])

  const allProjects = Object.values(projects)
  const activeProjects = allProjects.filter((p) => p.status === 'active')
  const pausedProjects = allProjects.filter((p) => p.status === 'paused')
  const completedProjects = allProjects.filter((p) => p.status === 'completed')
  const archivedProjects = allProjects.filter((p) => p.status === 'archived')

  const getProjectTasks = (project: Project) =>
    Object.values(tasks).filter((t) => t.parentProjectId === project.id)

  const getTaskCounts = (project: Project) => {
    const projectTasks = getProjectTasks(project)
    return {
      total: projectTasks.length,
      completed: projectTasks.filter((t) => t.status === 'done').length,
    }
  }

  const handleCreateProject = async (data: Partial<Project> & { title: string }) => {
    try {
      await addProject(data)
      setShowForm(false)
    } catch (err) {
      console.error('Error creating project:', err)
    }
  }

  const handleAddTask = async (title: string, priority: 'primordial' | 'importante' | 'puede_esperar', dayId?: string) => {
    if (!selectedProject) return
    try {
      const task = await addTask({
        title,
        priority,
        dayId: dayId || undefined,
        parentProjectId: selectedProject.id,
      })
      await addTaskToProject(selectedProject.id, task.id)
      setSelectedProject((prev) =>
        prev ? { ...prev, taskIds: [...prev.taskIds, task.id] } : prev
      )
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    const task = tasks[taskId]
    if (!task) return
    if (task.status === 'done') {
      await updateTask(taskId, { status: 'pending', completedAt: undefined })
    } else {
      await updateTask(taskId, { status: 'done', completedAt: new Date().toISOString() })
    }
  }

  const handleUpdateProject = async (updates: Partial<Project>) => {
    if (!selectedProject) return
    await updateProject(selectedProject.id, updates)
    setSelectedProject((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const handleArchive = async () => {
    if (!selectedProject) return
    await archiveProject(selectedProject.id)
    setSelectedProject(null)
  }

  const handleComplete = async () => {
    if (!selectedProject) return
    await completeProject(selectedProject.id)
    setSelectedProject(null)
  }

  const handleReopen = async () => {
    if (!selectedProject) return
    await reopenProject(selectedProject.id)
    setSelectedProject(null)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Modal overlay for form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowForm(false)}>
          <div className="card-m3 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-lg font-bold text-ae-text mb-4">Nuevo proyecto</h2>
              <ProjectForm onSave={handleCreateProject} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for detail */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedProject(null)}>
          <div className="card-m3 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <ProjectDetail
                project={selectedProject}
                tasks={getProjectTasks(selectedProject)}
                onClose={() => setSelectedProject(null)}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onUpdateProject={handleUpdateProject}
                onArchive={handleArchive}
                onComplete={handleComplete}
                onReopen={handleReopen}
              />
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title text-ae-text">📂 Proyectos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="tap-spring btn-primary text-sm"
        >
          Nuevo +
        </button>
      </div>

      {/* Empty state */}
      {allProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-ae-text-muted mb-4 text-sm">
            No tenés proyectos aún. Creá uno para organizar tareas grandes.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="tap-spring btn-primary text-sm"
          >
            Crear proyecto
          </button>
        </div>
      )}

      {/* Active projects */}
      {activeProjects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3">
            Activos · {activeProjects.length}
          </h2>
          <div className="grid gap-3">
            {activeProjects.map((project) => {
              const { total, completed } = getTaskCounts(project)
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasksCompleted={completed}
                  tasksTotal={total}
                  onClick={() => setSelectedProject(project)}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Paused projects */}
      {pausedProjects.length > 0 && (
        <section className="mb-6">
          <button
            onClick={() => setPausedOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3 hover:text-ae-text transition-colors"
          >
            <span>{pausedOpen ? '▼' : '▶'}</span>
            Pausados · {pausedProjects.length}
          </button>
          {pausedOpen && (
            <div className="grid gap-3">
              {pausedProjects.map((project) => {
                const { total, completed } = getTaskCounts(project)
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    tasksCompleted={completed}
                    tasksTotal={total}
                    onClick={() => setSelectedProject(project)}
                  />
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Completed projects */}
      {completedProjects.length > 0 && (
        <section className="mb-6">
          <button
            onClick={() => setCompletedOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3 hover:text-ae-text transition-colors"
          >
            <span>{completedOpen ? '▼' : '▶'}</span>
            Completados · {completedProjects.length}
          </button>
          {completedOpen && (
            <div className="grid gap-3">
              {completedProjects.map((project) => {
                const { total, completed } = getTaskCounts(project)
                return (
                  <div key={project.id} className="relative">
                    <ProjectCard
                      project={project}
                      tasksCompleted={completed}
                      tasksTotal={total}
                      onClick={() => setSelectedProject(project)}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); reopenProject(project.id) }}
                      className="tap-spring absolute top-2 right-2 px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 font-medium rounded-md hover:bg-amber-500/30 transition-colors"
                    >
                      Reabrir
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}
      {/* Archived projects */}
      {archivedProjects.length > 0 && (
        <section className="mb-6">
          <button
            onClick={() => setArchivedOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3 hover:text-ae-text transition-colors"
          >
            <span>{archivedOpen ? '▼' : '▶'}</span>
            Archivados · {archivedProjects.length}
          </button>
          {archivedOpen && (
            <div className="grid gap-3">
              {archivedProjects.map((project) => {
                const { total, completed } = getTaskCounts(project)
                return (
                  <div key={project.id} className="relative opacity-60">
                    <ProjectCard
                      project={project}
                      tasksCompleted={completed}
                      tasksTotal={total}
                      onClick={() => setSelectedProject(project)}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); unarchiveProject(project.id) }}
                      className="tap-spring absolute top-2 right-2 px-2 py-0.5 text-xs bg-ae-surface-2 text-ae-text-muted font-medium rounded-md hover:text-ae-text border border-ae-border transition-colors"
                    >
                      Desarchivar
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

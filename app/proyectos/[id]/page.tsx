"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import type { Project } from '@/types'
import ProjectDetail from '@/components/proyectos/ProjectDetail'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const { projects, loadProjects, updateProject, archiveProject, completeProject, addTaskToProject, isLoaded } =
    useProjectStore()
  const { tasks, loadToday, addTask, updateTask } = useTaskStore()

  const [localProject, setLocalProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!isLoaded) loadProjects()
    loadToday()
  }, [isLoaded, loadProjects, loadToday])

  useEffect(() => {
    if (isLoaded && id) {
      const found = projects[id]
      setLocalProject(found ?? null)
    }
  }, [isLoaded, projects, id])

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-ae-text-muted text-sm text-center">
        Cargando...
      </div>
    )
  }

  if (!localProject) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-ae-text-muted text-sm mb-4">Proyecto no encontrado.</p>
        <button
          onClick={() => router.push('/proyectos')}
          className="text-ae-primordial text-sm underline underline-offset-2"
        >
          ← Volver a proyectos
        </button>
      </div>
    )
  }

  const projectTasks = Object.values(tasks).filter((t) => t.parentProjectId === localProject.id)

  const handleAddTask = async (title: string) => {
    const task = await addTask({
      title,
      priority: 'puede_esperar',
      parentProjectId: localProject.id,
    })
    await addTaskToProject(localProject.id, task.id)
    setLocalProject((prev) =>
      prev ? { ...prev, taskIds: [...prev.taskIds, task.id] } : prev
    )
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
    await updateProject(localProject.id, updates)
    setLocalProject((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const handleArchive = async () => {
    await archiveProject(localProject.id)
    router.push('/proyectos')
  }

  const handleComplete = async () => {
    await completeProject(localProject.id)
    router.push('/proyectos')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="bg-ae-surface rounded-2xl p-6 border border-ae-border">
        <ProjectDetail
          project={localProject}
          tasks={projectTasks}
          onClose={() => router.push('/proyectos')}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onUpdateProject={handleUpdateProject}
          onArchive={handleArchive}
          onComplete={handleComplete}
        />
      </div>
    </div>
  )
}

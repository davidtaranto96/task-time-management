import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveProject, getAllProjects, deleteProject } from '@/lib/db'
import { createIDBStorage } from '@/lib/persistence'
import type { Project, ProjectCategory } from '@/types'

interface ProjectStoreState {
  projects: Record<string, Project>
  isLoaded: boolean

  loadProjects: () => Promise<void>
  addProject: (partial: Partial<Project> & { title: string }) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  archiveProject: (id: string) => Promise<void>
  completeProject: (id: string) => Promise<void>
  reopenProject: (id: string) => Promise<void>
  unarchiveProject: (id: string) => Promise<void>
  addTaskToProject: (projectId: string, taskId: string) => Promise<void>
  removeTaskFromProject: (projectId: string, taskId: string) => Promise<void>

  getActiveProjects: () => Project[]
  getArchivedProjects: () => Project[]
  getProjectById: (id: string) => Project | undefined
  getProjectsByCategory: (category: ProjectCategory) => Project[]
}

export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (setState, getState) => ({
      projects: {} as Record<string, Project>,
      isLoaded: false,

      loadProjects: async () => {
        const allProjects = await getAllProjects()
        const projectsMap: Record<string, Project> = {}
        for (const project of allProjects) {
          projectsMap[project.id] = project
        }
        setState({ projects: projectsMap, isLoaded: true })
      },

      addProject: async (partial) => {
        const project: Project = {
          id: crypto.randomUUID(),
          title: partial.title,
          description: partial.description,
          category: partial.category ?? 'personal',
          status: 'active',
          color: partial.color ?? '#3b82f6',
          icon: partial.icon,
          targetDate: partial.targetDate,
          createdAt: new Date().toISOString(),
          completedAt: undefined,
          taskIds: [],
          weeklyGoals: [],
          notes: partial.notes,
        }
        await saveProject(project)
        setState((state: ProjectStoreState) => ({
          projects: { ...state.projects, [project.id]: project },
        }))
        return project
      },

      updateProject: async (id, updates) => {
        const state = getState()
        const existing = state.projects[id]
        if (!existing) return
        const updated: Project = { ...existing, ...updates }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [id]: updated },
        }))
      },

      archiveProject: async (id) => {
        const state = getState()
        const existing = state.projects[id]
        if (!existing) return
        const updated: Project = { ...existing, status: 'archived' }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [id]: updated },
        }))
      },

      completeProject: async (id) => {
        const state = getState()
        const existing = state.projects[id]
        if (!existing) return
        const updated: Project = {
          ...existing,
          status: 'completed',
          completedAt: new Date().toISOString(),
        }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [id]: updated },
        }))
      },

      reopenProject: async (id) => {
        const state = getState()
        const existing = state.projects[id]
        if (!existing) return
        const updated: Project = { ...existing, status: 'active', completedAt: undefined }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [id]: updated },
        }))
      },

      unarchiveProject: async (id) => {
        const state = getState()
        const existing = state.projects[id]
        if (!existing) return
        const updated: Project = { ...existing, status: 'active' }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [id]: updated },
        }))
      },

      addTaskToProject: async (projectId, taskId) => {
        const state = getState()
        const existing = state.projects[projectId]
        if (!existing) return
        if (existing.taskIds.includes(taskId)) return
        const updated: Project = {
          ...existing,
          taskIds: [...existing.taskIds, taskId],
        }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [projectId]: updated },
        }))
      },

      removeTaskFromProject: async (projectId, taskId) => {
        const state = getState()
        const existing = state.projects[projectId]
        if (!existing) return
        const updated: Project = {
          ...existing,
          taskIds: existing.taskIds.filter((id) => id !== taskId),
        }
        await saveProject(updated)
        setState((s: ProjectStoreState) => ({
          projects: { ...s.projects, [projectId]: updated },
        }))
      },

      getActiveProjects: (): Project[] => {
        const state = getState()
        return Object.values(state.projects).filter((p) => p.status === 'active')
      },

      getArchivedProjects: (): Project[] => {
        const state = getState()
        return Object.values(state.projects).filter((p) => p.status === 'archived')
      },

      getProjectById: (id: string): Project | undefined => {
        const state = getState()
        return state.projects[id]
      },

      getProjectsByCategory: (category: ProjectCategory): Project[] => {
        const state = getState()
        return Object.values(state.projects).filter(
          (p) => p.category === category
        )
      },
    }),
    {
      name: 'ae-projects',
      storage: createIDBStorage(),
      partialize: (state) => ({ projects: state.projects }),
    }
  )
)

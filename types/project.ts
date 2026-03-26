export type ProjectCategory = "professional" | "personal" | "health" | "learning" | "travel"
export type ProjectStatus = "active" | "completed" | "paused" | "archived"

export interface Project {
  id: string
  title: string
  description?: string
  category: ProjectCategory
  status: ProjectStatus
  color: string               // hex color for UI identification
  icon?: string               // emoji icon
  targetDate?: string         // ISO date string - deadline/goal date
  createdAt: string           // ISO date string
  completedAt?: string        // ISO date string
  taskIds: string[]           // linked task IDs (across all days)
  weeklyGoals: string[]       // text goals set per week
  notes?: string              // free-form notes
}

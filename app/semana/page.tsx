"use client"

import { useEffect, useState, useCallback } from 'react'
import { useWeeklyStore } from '@/store/weeklyStore'
import { useTaskStore } from '@/store/taskStore'
import { useProjectStore } from '@/store/projectStore'
import { getWeekStart, getWeekDayIds } from '@/lib/weekUtils'
import { getTodayId } from '@/lib/dateUtils'
import { getTasksByDay } from '@/lib/db'
import WeekHeader from '@/components/semana/WeekHeader'
import WeekGoals from '@/components/semana/WeekGoals'
import WeekGrid from '@/components/semana/WeekGrid'
import DayDetail from '@/components/semana/DayDetail'
import type { Task } from '@/types/task'

function getWeekIdWithOffset(offset: number): string {
  const base = new Date()
  base.setDate(base.getDate() + offset * 7)
  const d = new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `week-${d.getUTCFullYear()}-${String(weekNum).padStart(2, '0')}`
}

function getWeekStartFromId(weekId: string): Date {
  const parts = weekId.split('-')
  const year = parseInt(parts[1])
  const week = parseInt(parts[2])
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
  return monday
}

export default function SemanaPage() {
  const { currentWeek, loadWeek, updateGoals } = useWeeklyStore()
  const { tasks: todayTasks, loadToday } = useTaskStore()
  const { getActiveProjects, loadProjects } = useProjectStore()

  const [weekOffset, setWeekOffset] = useState(0)
  const [weekTasks, setWeekTasks] = useState<Record<string, Task>>({})
  const [selectedDayId, setSelectedDayId] = useState<string>('')
  const todayId = getTodayId()

  const weekId = getWeekIdWithOffset(weekOffset)
  const weekStartDate = getWeekStartFromId(weekId)
  // Set default selected day when week changes
  useEffect(() => {
    if (weekOffset === 0) {
      // Current week: select today
      setSelectedDayId(todayId)
    } else {
      // Other weeks: select Monday
      const monday = getWeekDayIds(getWeekStartFromId(getWeekIdWithOffset(weekOffset)))[0]
      setSelectedDayId(monday)
    }
  }, [weekOffset, todayId])

  // Load week plan and projects
  useEffect(() => {
    loadWeek(weekId)
    loadProjects()
  }, [weekId])

  // Load today's tasks into store
  useEffect(() => {
    loadToday()
  }, [])

  // Load all tasks for the week from DB
  useEffect(() => {
    const ws = getWeekStart(weekStartDate)
    const ids = getWeekDayIds(ws)

    async function fetchWeekTasks() {
      const allTasks: Record<string, Task> = {}
      await Promise.all(
        ids.map(async (dayId) => {
          const dayTaskList = await getTasksByDay(dayId)
          for (const t of dayTaskList) {
            allTasks[t.id] = t
          }
        })
      )
      setWeekTasks(allTasks)
    }
    fetchWeekTasks()
  }, [weekId])

  const handlePrevWeek = useCallback(() => setWeekOffset((o) => o - 1), [])
  const handleNextWeek = useCallback(() => setWeekOffset((o) => o + 1), [])

  const handleGoalsChange = useCallback(
    (goals: Array<{text: string, done: boolean}>) => {
      updateGoals(goals)
    },
    [updateGoals]
  )

  const handleDayClick = useCallback((dayId: string) => {
    setSelectedDayId(dayId)
  }, [])

  const handleTasksChange = useCallback((updatedDayTasks: Record<string, Task>) => {
    setWeekTasks((prev) => {
      // Remove old tasks for this day, add new ones
      const next = { ...prev }
      // Remove tasks belonging to the selected day that are no longer present
      for (const key of Object.keys(next)) {
        if (next[key].dayId === selectedDayId && !(key in updatedDayTasks)) {
          delete next[key]
        }
      }
      // Merge updated tasks
      for (const [id, task] of Object.entries(updatedDayTasks)) {
        next[id] = task
      }
      return next
    })
  }, [selectedDayId])

  // Merge today tasks into weekTasks for current week display
  const mergedTasks = weekOffset === 0
    ? { ...weekTasks, ...todayTasks }
    : weekTasks

  const selectedDayTasks = selectedDayId
    ? Object.values(mergedTasks).filter((t) => t.dayId === selectedDayId)
    : []

  const activeProjects = getActiveProjects()

  // Normalize goals from old format (string[]) to new format
  const normalizedGoals: Array<{text: string, done: boolean}> = (currentWeek?.primordialGoals ?? []).map((g: string | {text: string, done: boolean}) => {
    if (typeof g === 'string') return { text: g, done: false }
    return g
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <WeekHeader
        weekId={weekId}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />

      <WeekGrid
        weekStart={weekStartDate}
        tasks={mergedTasks}
        todayId={todayId}
        selectedDayId={selectedDayId}
        onDayClick={handleDayClick}
      />

      {selectedDayId && (
        <DayDetail
          dayId={selectedDayId}
          tasks={selectedDayTasks}
          onTasksChange={handleTasksChange}
        />
      )}

      <WeekGoals
        goals={normalizedGoals}
        onChange={handleGoalsChange}
      />

      {/* Active projects this week */}
      {activeProjects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3">
            Proyectos activos
          </h2>
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="flex gap-3 min-w-max pb-1">
              {activeProjects.map((project) => {
                const projectTaskCount = project.taskIds.length
                const completedCount = project.taskIds.filter((id) => {
                  const task = mergedTasks[id]
                  return task?.status === 'done'
                }).length
                const progress = projectTaskCount > 0
                  ? Math.round((completedCount / projectTaskCount) * 100)
                  : 0

                return (
                  <div
                    key={project.id}
                    className="bg-ae-surface border border-ae-border rounded-xl p-3 min-w-[140px] max-w-[180px]"
                    style={{ borderLeftColor: project.color, borderLeftWidth: 3 }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {project.icon && <span className="text-base">{project.icon}</span>}
                      <span className="text-xs font-semibold text-ae-text truncate">{project.title}</span>
                    </div>
                    {projectTaskCount > 0 && (
                      <>
                        <div className="w-full h-1 bg-ae-surface-2 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${progress}%`, backgroundColor: project.color }}
                          />
                        </div>
                        <p className="text-xs text-ae-text-muted mt-1">{completedCount}/{projectTaskCount} tareas</p>
                      </>
                    )}
                    {projectTaskCount === 0 && (
                      <p className="text-xs text-ae-text-muted mt-1">Sin tareas</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

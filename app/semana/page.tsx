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
  // ISO week calculation
  const d = new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `week-${d.getUTCFullYear()}-${String(weekNum).padStart(2, '0')}`
}

export default function SemanaPage() {
  const { currentWeek, loadWeek, updateGoals } = useWeeklyStore()
  const { tasks: todayTasks, loadToday } = useTaskStore()
  const { getActiveProjects, loadProjects } = useProjectStore()

  const [weekOffset, setWeekOffset] = useState(0)
  const [weekTasks, setWeekTasks] = useState<Record<string, Task>>({})
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const todayId = getTodayId()

  const weekId = getWeekIdWithOffset(weekOffset)

  // Load week plan and tasks
  useEffect(() => {
    loadWeek(weekId)
    loadProjects()
  }, [weekId])

  // Load today's tasks into store (for current week, supplement with DB)
  useEffect(() => {
    loadToday()
  }, [])

  // Load all tasks for the week from DB
  useEffect(() => {
    const weekStart = getWeekStart(new Date(
      // derive a date in this week from the weekId
      (() => {
        const parts = weekId.split('-')
        const year = parseInt(parts[1])
        const week = parseInt(parts[2])
        const jan4 = new Date(year, 0, 4)
        const dayOfWeek = jan4.getDay() || 7
        const monday = new Date(jan4)
        monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
        return monday
      })()
    ))
    const dayIds = getWeekDayIds(weekStart)

    async function fetchWeekTasks() {
      const allTasks: Record<string, Task> = {}
      await Promise.all(
        dayIds.map(async (dayId) => {
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
    (goals: string[]) => {
      updateGoals(goals)
    },
    [updateGoals]
  )

  const handleDayClick = useCallback((dayId: string) => {
    setSelectedDayId(dayId)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedDayId(null)
  }, [])

  const handleAddTask = useCallback(
    async (title: string) => {
      if (!selectedDayId) return
      const { saveTask } = await import('@/lib/db')
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        priority: 'importante',
        status: 'pending',
        dayId: selectedDayId,
        createdAt: new Date().toISOString(),
      }
      await saveTask(newTask)
      setWeekTasks((prev) => ({ ...prev, [newTask.id]: newTask }))
    },
    [selectedDayId]
  )

  const weekStartDate = (() => {
    const parts = weekId.split('-')
    const year = parseInt(parts[1])
    const week = parseInt(parts[2])
    const jan4 = new Date(year, 0, 4)
    const dayOfWeek = jan4.getDay() || 7
    const monday = new Date(jan4)
    monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
    return monday
  })()

  const activeProjects = getActiveProjects()

  const selectedDayTasks = selectedDayId
    ? Object.values(weekTasks).filter((t) => t.dayId === selectedDayId)
    : []

  // Merge today tasks into weekTasks for current week display
  const mergedTasks = weekOffset === 0
    ? { ...weekTasks, ...todayTasks }
    : weekTasks

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <WeekHeader
        weekId={weekId}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />

      <WeekGoals
        goals={currentWeek?.primordialGoals ?? ['', '', '']}
        onChange={handleGoalsChange}
      />

      <WeekGrid
        weekStart={weekStartDate}
        tasks={mergedTasks}
        todayId={todayId}
        onDayClick={handleDayClick}
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

      {/* Day detail modal */}
      {selectedDayId && (
        <DayDetail
          dayId={selectedDayId}
          tasks={selectedDayTasks}
          onClose={handleCloseDetail}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  )
}

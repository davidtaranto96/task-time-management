"use client"

import DayColumn from './DayColumn'
import { getWeekDayIds } from '@/lib/weekUtils'
import type { Task } from '@/types/task'

interface WeekGridProps {
  weekStart: Date
  tasks: Record<string, Task>
  todayId: string
  onDayClick: (dayId: string) => void
}

export default function WeekGrid({ weekStart, tasks, todayId, onDayClick }: WeekGridProps) {
  const dayIds = getWeekDayIds(weekStart)
  const allTasks = Object.values(tasks)

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wider mb-3">
        Días de la semana
      </h2>
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-2 min-w-max">
          {dayIds.map((dayId) => {
            const dayTasks = allTasks.filter((t) => t.dayId === dayId)
            return (
              <DayColumn
                key={dayId}
                dayId={dayId}
                tasks={dayTasks}
                isToday={dayId === todayId}
                onClick={() => onDayClick(dayId)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"

import { getWeekDayIds } from '@/lib/weekUtils'
import type { Task } from '@/types/task'

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface WeekGridProps {
  weekStart: Date
  tasks: Record<string, Task>
  todayId: string
  selectedDayId: string
  onDayClick: (dayId: string) => void
}

export default function WeekGrid({ weekStart, tasks, todayId, selectedDayId, onDayClick }: WeekGridProps) {
  const dayIds = getWeekDayIds(weekStart)
  const allTasks = Object.values(tasks)

  return (
    <div className="mb-5">
      <div className="flex gap-1.5">
        {dayIds.map((dayId, i) => {
          const dayTasks = allTasks.filter((t) => t.dayId === dayId && t.status !== 'deleted')
          const dateNum = new Date(dayId + 'T00:00:00').getDate()
          const isToday = dayId === todayId
          const isSelected = dayId === selectedDayId
          const taskCount = dayTasks.length
          const doneCount = dayTasks.filter((t) => t.status === 'done').length

          return (
            <button
              key={dayId}
              onClick={() => onDayClick(dayId)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl border transition-all text-center min-w-0
                ${isSelected
                  ? 'bg-ae-surface border-ae-primordial shadow-sm shadow-ae-primordial/20'
                  : 'bg-ae-surface border-ae-border hover:border-ae-text-muted'
                }
              `}
            >
              <span className={`text-xs font-semibold uppercase ${isSelected ? 'text-ae-primordial' : 'text-ae-text-muted'}`}>
                {DAY_NAMES[i]}
              </span>
              <span className={`text-lg font-bold ${isSelected ? 'text-ae-text' : 'text-ae-text'}`}>
                {dateNum}
              </span>
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-ae-primordial" />
              )}
              {!isToday && <span className="w-1.5 h-1.5" />}
              {taskCount > 0 && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  doneCount === taskCount
                    ? 'bg-ae-success/20 text-ae-success'
                    : 'bg-ae-surface-2 text-ae-text-muted'
                }`}>
                  {doneCount}/{taskCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

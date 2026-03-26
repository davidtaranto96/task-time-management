import type { Habit, HabitCompletion } from '@/types/habit'
import { parseDayId } from '@/lib/dateUtils'

interface WeekGridProps {
  habits: Habit[]
  completions: HabitCompletion[]
  last7Days: string[]
}

const DAY_ABBR = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export default function WeekGrid({ habits, completions, last7Days }: WeekGridProps) {
  // last7Days is newest-first from getLastNDays, reverse to show oldest→newest left→right
  const days = [...last7Days].reverse()

  if (habits.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] table-fixed text-sm">
        <thead>
          <tr>
            <th className="w-32 pb-2 text-left text-xs font-medium text-ae-text-muted" />
            {days.map((dayId) => {
              const d = parseDayId(dayId)
              const abbr = DAY_ABBR[d.getDay()]
              const dayNum = d.getDate()
              return (
                <th key={dayId} className="pb-2 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-medium text-ae-text-muted">{abbr}</span>
                    <span className="text-xs text-ae-text-muted/60">{dayNum}</span>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id} className="border-t border-ae-border/30">
              <td className="py-2 pr-2">
                <span className="block truncate text-xs text-ae-text">
                  {habit.icon && <span className="mr-1">{habit.icon}</span>}
                  {habit.title}
                </span>
              </td>
              {days.map((dayId) => {
                const isCompleted = completions.some(
                  (c) => c.habitId === habit.id && c.dayId === dayId
                )

                // For weekly habits: determine if this day is "in scope" — only show dot on the day it was completed or today
                const isDue = habit.frequency === 'daily' || isCompleted

                return (
                  <td key={dayId} className="py-2 text-center">
                    {isDue ? (
                      <span
                        className={`mx-auto block h-3 w-3 rounded-full ${
                          isCompleted ? 'bg-ae-success' : 'bg-ae-border'
                        }`}
                      />
                    ) : (
                      <span className="mx-auto block h-3 w-3" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

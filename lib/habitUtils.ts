import type { Habit, HabitCompletion } from '@/types/habit'

/**
 * Calculate streak for a habit (consecutive completions)
 * For daily: consecutive days
 * For weekly: consecutive weeks
 */
export function calculateStreak(
  completions: HabitCompletion[],
  frequency: 'daily' | 'weekly'
): number {
  if (completions.length === 0) return 0

  const sorted = [...completions].sort(
    (a, b) => new Date(b.dayId).getTime() - new Date(a.dayId).getTime()
  )

  if (frequency === 'daily') {
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dayId = checkDate.toISOString().split('T')[0]

      if (sorted.some((c) => c.dayId === dayId)) {
        streak++
      } else if (i === 0) {
        // Today not completed yet — don't break streak, skip
        continue
      } else {
        break
      }
    }
    return streak
  }

  // Weekly: count consecutive weeks with at least one completion
  let streak = 0
  const now = new Date()
  for (let w = 0; w < 52; w++) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 - w * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const startId = weekStart.toISOString().split('T')[0]
    const endId = weekEnd.toISOString().split('T')[0]

    const hasCompletion = sorted.some((c) => c.dayId >= startId && c.dayId <= endId)
    if (hasCompletion) {
      streak++
    } else if (w === 0) {
      continue // current week not done yet
    } else {
      break
    }
  }
  return streak
}

/**
 * Check if a habit is due today
 * Daily habits are always due. Weekly habits are due if not completed this week.
 */
export function isHabitDueToday(
  habit: Habit,
  todayId: string,
  completions: HabitCompletion[]
): boolean {
  if (habit.isArchived) return false
  if (habit.frequency === 'daily') return true

  // Weekly: check if completed this week (Mon-Sun)
  const today = new Date(todayId)
  const monday = new Date(today)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const mondayId = monday.toISOString().split('T')[0]

  return !completions.some(
    (c) => c.habitId === habit.id && c.dayId >= mondayId && c.dayId <= todayId
  )
}

/**
 * Get completion rate over last N days (0-100)
 */
export function getCompletionRate(
  completions: HabitCompletion[],
  habitId: string,
  days: number
): number {
  const now = new Date()
  let completed = 0
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dayId = d.toISOString().split('T')[0]
    if (completions.some((c) => c.habitId === habitId && c.dayId === dayId)) {
      completed++
    }
  }
  return Math.round((completed / days) * 100)
}

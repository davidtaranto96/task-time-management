export function getTodayId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toDateId(isoString: string): string {
  return isoString.slice(0, 10)
}

export function isToday(dayId: string): boolean {
  return dayId === getTodayId()
}

export function getYesterdayId(): string {
  return getDaysAgo(1)
}

export function getDaysAgo(n: number): string {
  const date = new Date()
  date.setDate(date.getDate() - n)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => getDaysAgo(i))
}

export function parseDayId(dayId: string): Date {
  const [year, month, day] = dayId.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getDayLabel(dayId: string): string {
  if (isToday(dayId)) return 'Hoy'
  if (dayId === getYesterdayId()) return 'Ayer'
  const date = parseDayId(dayId)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function areConsecutiveDays(a: string, b: string): boolean {
  const dateA = parseDayId(a)
  const dateB = parseDayId(b)
  const diffMs = dateB.getTime() - dateA.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays === 1
}

export function calculateStreakFromDays(successfulDays: string[]): { currentStreak: number; longestStreak: number } {
  if (successfulDays.length === 0) return { currentStreak: 0, longestStreak: 0 }

  // successfulDays is sorted ascending
  let longestStreak = 1
  let currentRun = 1

  for (let i = 1; i < successfulDays.length; i++) {
    if (areConsecutiveDays(successfulDays[i - 1], successfulDays[i])) {
      currentRun++
      if (currentRun > longestStreak) longestStreak = currentRun
    } else {
      currentRun = 1
    }
  }

  // Calculate current streak from the end
  const today = getTodayId()
  const yesterday = getYesterdayId()
  const lastDay = successfulDays[successfulDays.length - 1]

  // If last successful day is not today or yesterday, streak is broken
  if (lastDay !== today && lastDay !== yesterday) {
    return { currentStreak: 0, longestStreak }
  }

  let currentStreak = 1
  for (let i = successfulDays.length - 2; i >= 0; i--) {
    if (areConsecutiveDays(successfulDays[i], successfulDays[i + 1])) {
      currentStreak++
    } else {
      break
    }
  }

  return { currentStreak, longestStreak }
}

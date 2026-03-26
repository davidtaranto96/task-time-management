/**
 * Get ISO week number for a date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * Get week ID in format "week-YYYY-WW"
 */
export function getWeekId(date: Date = new Date()): string {
  const weekNum = getWeekNumber(date)
  const year = date.getFullYear()
  return `week-${year}-${String(weekNum).padStart(2, '0')}`
}

/**
 * Get current week ID
 */
export function getCurrentWeekId(): string {
  return getWeekId(new Date())
}

/**
 * Get Monday (start) of the week containing the given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get Sunday (end) of the week containing the given date
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

/**
 * Get all 7 day IDs (YYYY-MM-DD) for a given week start date
 */
export function getWeekDayIds(weekStart: Date): string[] {
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

/**
 * Get days remaining in the current week (including today)
 */
export function getDaysRemainingInWeek(): number {
  const today = new Date()
  const day = today.getDay()
  return day === 0 ? 1 : 8 - day // 0=Sun→1, 1=Mon→7, 6=Sat→2
}

/**
 * Format a week ID to a human-readable range
 * e.g., "week-2026-13" → "24 Mar – 30 Mar 2026"
 */
export function formatWeekRange(weekId: string): string {
  const parts = weekId.split('-')
  const year = parseInt(parts[1])
  const week = parseInt(parts[2])

  // Get Jan 4 of that year (always in week 1)
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  const startStr = `${monday.getDate()} ${months[monday.getMonth()]}`
  const endStr = `${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`

  return `${startStr} – ${endStr}`
}

export interface WeeklyPlan {
  id: string                  // format: "week-YYYY-WW" (e.g., "week-2026-13")
  weekStart: string           // ISO date of Monday
  weekEnd: string             // ISO date of Sunday
  primordialGoals: string[]   // max 3 "Lo Primordial de la Semana" text items
  projectFocus: string[]      // project IDs to focus this week
  reflection?: string         // end-of-week reflection
  createdAt: string
  isComplete: boolean
}

export interface WeekDay {
  dayId: string               // YYYY-MM-DD
  weekId: string              // references WeeklyPlan.id
  signalTaskIds: string[]     // planned signal tasks for this day
  noiseTaskIds: string[]      // planned noise tasks for this day
}

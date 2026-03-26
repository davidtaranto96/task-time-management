export type MoodLevel = 1 | 2 | 3 | 4 | 5  // 1=terrible, 5=excellent

export interface JournalEntry {
  id: string
  dayId: string               // YYYY-MM-DD
  reflection: string          // free-text reflection
  mood?: MoodLevel
  gratitude?: string          // what are you grateful for today
  lessonsLearned?: string     // key learning of the day
  tomorrowFocus?: string      // what will you focus on tomorrow
  createdAt: string
  updatedAt: string
}

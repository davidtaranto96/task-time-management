interface StreakBadgeProps {
  streak: number
  size?: 'sm' | 'md'
}

export default function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  if (streak === 0) return <span className="text-ae-text-muted">—</span>

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1'
  const glow = streak >= 7 ? 'shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold ${textSize} ${padding} ${glow}`}
    >
      🔥{streak}
      {streak >= 30 && <span className="ml-0.5">💪</span>}
    </span>
  )
}

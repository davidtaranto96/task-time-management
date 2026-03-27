"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { hapticLight } from '@/lib/haptics'
import { useTimerStore } from '@/store/timerStore'

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/hoy',     label: 'Hoy',     icon: '☀️' },
  { href: '/semana',  label: 'Semana',  icon: '📅' },
  { href: '/inbox',   label: 'Inbox',   icon: '📥' },
  { href: '/enfoque', label: 'Enfoque', icon: '🎯' },
  { href: '/mas',     label: 'Más',     icon: null },
]

export function BottomNav() {
  const pathname = usePathname()
  const timerStatus = useTimerStore((s) => s.timer.status)
  const focusActive = timerStatus === 'running' || timerStatus === 'paused'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ae-border bg-ae-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const isEnfoque = item.href === '/enfoque'
          const isMas = item.href === '/mas'

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => hapticLight()}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? 'text-ae-primordial' : 'text-ae-text-muted hover:text-ae-text'
              }`}
            >
              {/* Focus active badge */}
              {isEnfoque && focusActive && !isActive && (
                <span className="absolute top-1 right-[calc(50%-14px)] flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
              )}

              <span className="text-lg flex items-center justify-center h-6 w-6">
                {isMas ? <GridIcon /> : item.icon}
              </span>
              <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/hoy', label: 'Hoy', icon: '☀️' },
  { href: '/semana', label: 'Semana', icon: '📅' },
  { href: '/inbox', label: 'Inbox', icon: '📥' },
  { href: '/enfoque', label: 'Enfoque', icon: '🎯' },
  { href: '/mas', label: 'Más', icon: '⋯' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ae-border bg-ae-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive
                  ? 'text-ae-primordial'
                  : 'text-ae-text-muted hover:text-ae-text'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

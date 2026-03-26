"use client"

import Link from "next/link"

type Page = "intake" | "bunker" | "bandeja" | "dashboard"

interface BottomNavProps {
  currentPage: Page
}

const navItems: { page: Page; label: string; icon: string; href: string }[] = [
  { page: "intake", label: "Filtro", icon: "🎯", href: "/intake" },
  { page: "bunker", label: "Bunker", icon: "🔒", href: "/bunker" },
  { page: "bandeja", label: "Bandeja", icon: "📭", href: "/bandeja" },
  { page: "dashboard", label: "Dashboard", icon: "📊", href: "/dashboard" },
]

export default function BottomNav({ currentPage }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-ae-border"
      style={{ background: "#0a0a0b" }}
    >
      <div className="flex items-center justify-around w-full max-w-2xl mx-auto px-2 py-2">
        {navItems.map((item) => {
          const isActive = item.page === currentPage
          return (
            <Link
              key={item.page}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors"
              style={{ minWidth: 56 }}
            >
              <span className="text-2xl leading-none">{item.icon}</span>
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? "#f59e0b" : "#71717a" }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

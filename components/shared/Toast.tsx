"use client"
import { useEffect } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
  duration?: number
}

export function Toast({ message, onDone, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [onDone, duration])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg animate-fade-in">
      {message}
    </div>
  )
}

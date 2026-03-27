"use client"

import { useState } from 'react'
import { setUserName } from '@/lib/userSettings'

interface Props {
  onDone: (name: string) => void
}

export default function OnboardingScreen({ onDone }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(true)
      return
    }
    setUserName(trimmed)
    onDone(trimmed)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ae-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo / Icon */}
        <div className="space-y-3">
          <div className="text-6xl">🎯</div>
          <h1 className="text-3xl font-bold text-ae-text">Bienvenido a Enfoque</h1>
          <p className="text-ae-text-muted text-sm leading-relaxed">
            Tu sistema personal de organización y productividad.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-ae-text">
              ¿Cómo te llamás?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(false) }}
              placeholder="Tu nombre"
              autoFocus
              className={`w-full rounded-xl bg-ae-surface border px-4 py-3 text-ae-text placeholder-ae-text-muted focus:outline-none focus:ring-2 focus:ring-ae-primordial transition-all ${
                error ? 'border-red-500' : 'border-ae-border'
              }`}
            />
            {error && (
              <p className="text-xs text-red-400">Ingresá tu nombre para continuar.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-ae-primordial py-3 text-base font-bold text-black transition-opacity hover:opacity-90 active:opacity-80"
          >
            Comenzar 🚀
          </button>
        </form>

        <p className="text-xs text-ae-text-muted">
          Solo se guarda en tu dispositivo. Sin cuenta ni registro.
        </p>
      </div>
    </div>
  )
}

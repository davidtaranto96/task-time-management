"use client"

interface CeroRuidoToggleProps {
  enabled: boolean
  onToggle: () => void
}

export default function CeroRuidoToggle({ enabled, onToggle }: CeroRuidoToggleProps) {
  return (
    <div className="bg-ae-surface border border-ae-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ae-text">🔕 Cero Ruido</span>
          <span className="text-xs text-ae-text-muted">
            {enabled
              ? "Tareas de ruido ocultas hasta las 12:00 PM"
              : "Mostrar todas las tareas"}
          </span>
        </div>

        {/* Toggle switch */}
        <button
          onClick={onToggle}
          role="switch"
          aria-checked={enabled}
          className={`relative w-11 h-6 rounded-full border transition-all duration-200 shrink-0 ${
            enabled
              ? "bg-ae-accent border-ae-accent"
              : "bg-ae-surface-2 border-ae-border"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <p className="text-xs text-ae-text-muted border-t border-ae-border pt-2">
        Protege tus horas de oro para trabajo profundo
      </p>
    </div>
  )
}

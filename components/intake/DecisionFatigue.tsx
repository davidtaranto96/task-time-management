"use client"

interface DecisionFatigueProps {
  show: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DecisionFatigue({ show, onConfirm, onCancel }: DecisionFatigueProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative bg-ae-surface border border-ae-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Warning icon */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-ae-text font-bold text-lg leading-tight">
            Alerta: Fatiga de Decisión
          </h2>
        </div>

        <p className="text-ae-text-muted text-sm leading-relaxed mb-8">
          Jeff Bezos solo toma 3 decisiones de alta calidad al día. Agregar una cuarta tarea primordial puede reducir la calidad de todas.{" "}
          <span className="text-ae-text">
            ¿Estás seguro de que esta tarea es realmente vital?
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-ae-signal text-ae-bg font-bold text-sm py-3 px-6 rounded-lg hover:brightness-110 transition-all active:scale-95"
          >
            Sí, es vital
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-ae-surface-2 border border-ae-border text-ae-text-muted hover:text-ae-text font-medium text-sm py-3 px-6 rounded-lg hover:bg-ae-surface transition-all active:scale-95"
          >
            Cancelar, la muevo a Ruido
          </button>
        </div>
      </div>
    </div>
  )
}

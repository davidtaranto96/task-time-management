"use client"

interface CEOLockProps {
  active: boolean
  taskTitle: string
  onDeactivate: () => void
}

export default function CEOLock({ active, taskTitle, onDeactivate }: CEOLockProps) {
  if (!active) return null

  return (
    <div className="fixed inset-0 z-50 bg-ae-bg flex flex-col items-center justify-center">
      {/* Centered task content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div className="flex items-center gap-2 text-ae-accent text-xs font-semibold tracking-widest uppercase">
          <span>▮</span>
          <span>Modo CEO Activo</span>
        </div>
        <h1 className="text-4xl font-bold text-ae-text leading-tight max-w-lg">
          {taskTitle}
        </h1>
        <p className="text-ae-text-muted text-sm">Enfócate. Nada más importa ahora.</p>
      </div>

      {/* Barely visible exit button at very bottom */}
      <div className="pb-6">
        <button
          onClick={onDeactivate}
          className="text-ae-noise/40 text-xs hover:text-ae-noise/70 transition-colors"
        >
          Salir del Modo CEO
        </button>
      </div>
    </div>
  )
}

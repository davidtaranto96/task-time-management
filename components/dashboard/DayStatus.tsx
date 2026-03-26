"use client"

interface DayStatusProps {
  isSuccessful: boolean
  primordialDone: number
  primordialTotal: number
  date: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export default function DayStatus({ isSuccessful, primordialDone, primordialTotal, date }: DayStatusProps) {
  const formattedDate = formatDate(date)

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border p-6 text-center"
      style={{
        background: isSuccessful
          ? "linear-gradient(135deg, #10b98110, #111113)"
          : primordialTotal === 0
          ? "#111113"
          : "linear-gradient(135deg, #f59e0b0d, #111113)",
        borderColor: isSuccessful ? "#10b98140" : primordialTotal === 0 ? "#2a2a35" : "#f59e0b30",
      }}
    >
      {/* Date */}
      <span className="text-ae-text-muted text-xs capitalize tracking-wide">{formattedDate}</span>

      {primordialTotal === 0 ? (
        <>
          <span className="text-4xl">📋</span>
          <span className="text-ae-text-muted text-base font-medium">Sin tareas primordiales asignadas</span>
        </>
      ) : isSuccessful ? (
        <>
          <span className="text-5xl" style={{ filter: "drop-shadow(0 0 12px #10b98188)" }}>✅</span>
          <span
            className="text-ae-success text-2xl font-bold tracking-widest uppercase"
            style={{ textShadow: "0 0 12px #10b98155" }}
          >
            DÍA EXITOSO
          </span>
          <p className="text-ae-text-muted text-sm leading-relaxed max-w-xs">
            Has completado tus decisiones de alto impacto. El 70% restante puede esperar.
          </p>
        </>
      ) : (
        <>
          <span className="text-5xl">⏳</span>
          <span className="text-ae-signal text-xl font-bold tracking-widest uppercase">EN PROGRESO</span>
          <p className="text-ae-text-muted text-sm leading-relaxed max-w-xs">
            Completa tus tareas primordiales para marcar el día como exitoso
          </p>
          <span className="text-ae-text-muted text-xs">
            {primordialDone} de {primordialTotal} completadas
          </span>
        </>
      )}
    </div>
  )
}

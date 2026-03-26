"use client"

import type { ImpactSession } from "@/types/dashboard"

interface ImpactHoursProps {
  hours: number
  sessions: ImpactSession[]
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false })
}

export default function ImpactHours({ hours, sessions }: ImpactHoursProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-start gap-1">
        <span className="text-ae-signal font-bold tabular-nums" style={{ fontSize: "3.5rem", lineHeight: 1 }}>
          {hours.toFixed(1)}h
        </span>
        <span className="text-ae-text font-semibold text-base">Horas de Alto Impacto</span>
        <span className="text-ae-text-muted text-sm">
          {sessions.length} sesión{sessions.length !== 1 ? "es" : ""} completada{sessions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-ae-text-muted text-sm leading-relaxed">
          Aún no has iniciado ninguna sesión. ¡Empieza en el Bunker!
        </p>
      ) : (
        <div className="flex flex-col gap-2 mt-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between bg-ae-surface-2 border border-ae-border rounded-lg px-3 py-2"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-ae-text text-sm font-medium truncate max-w-[160px]">
                  {session.taskTitle}
                </span>
                <span className="text-ae-text-muted text-xs">
                  {formatTime(session.startedAt)} – {session.endedAt ? formatTime(session.endedAt) : "..."}
                </span>
              </div>
              <span className="text-ae-signal text-xs font-semibold whitespace-nowrap ml-2">
                {session.durationMinutes}m
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

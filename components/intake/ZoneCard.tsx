"use client"

import type { Task } from "@/types/task"

interface ZoneCardProps {
  zone: "signal" | "noise"
  tasks: Task[]
  maxTasks?: number
  onMoveTask?: (taskId: string, targetZone: "signal" | "noise") => void
  onSetGolden?: (taskId: string) => void
  onRemoveTask?: (taskId: string) => void
}

export default function ZoneCard({
  zone,
  tasks,
  maxTasks,
  onMoveTask,
  onSetGolden,
  onRemoveTask,
}: ZoneCardProps) {
  const isSignal = zone === "signal"
  const targetZone = isSignal ? "noise" : "signal"
  const isFull = maxTasks !== undefined && tasks.length >= maxTasks

  const headerColor = isSignal ? "text-ae-signal" : "text-ae-noise"
  const borderColor = isSignal ? "border-ae-signal/25" : "border-ae-border"
  const countColor = isSignal ? "text-ae-signal" : "text-ae-text-muted"

  return (
    <div
      className={`bg-ae-surface border ${borderColor} rounded-xl overflow-hidden flex flex-col ${
        isSignal ? "shadow-lg shadow-ae-signal/10" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 border-b ${borderColor} ${
          isSignal ? "bg-ae-signal/5" : "bg-ae-surface"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-bold text-sm ${headerColor}`}>
            {isSignal ? "⚡ Zona Señal (30%)" : "📭 Zona Ruido (70%)"}
          </h3>
          <div className="flex items-center gap-2">
            {isFull && (
              <span className="text-xs font-semibold text-ae-signal bg-ae-signal/10 border border-ae-signal/30 px-2 py-0.5 rounded-full">
                Zona llena
              </span>
            )}
            <span className={`text-xs font-mono font-bold ${countColor}`}>
              {tasks.length}{maxTasks !== undefined ? `/${maxTasks}` : ""}
            </span>
          </div>
        </div>
        <p className="text-ae-text-muted text-xs">
          {isSignal
            ? "Decisiones Tipo 1 · Irreversibles · Máximo 2 tareas"
            : "Tareas reversibles · Correos · Logística"}
        </p>
      </div>

      {/* Task list */}
      <div className="flex-1 p-3 flex flex-col gap-2 min-h-[120px]">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-ae-text-muted text-xs text-center">
              {isSignal
                ? "Sin tareas primordiales aún"
                : "Sin tareas de ruido"}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center gap-2 bg-ae-surface-2 border rounded-lg px-3 py-2.5 transition-all ${
                isSignal
                  ? "border-ae-signal/20 shadow-sm shadow-ae-signal/10 hover:shadow-ae-signal/20"
                  : "border-ae-border"
              } ${task.isGoldenTask ? "ring-1 ring-ae-signal/50" : ""}`}
            >
              {/* Golden star (signal only) */}
              {isSignal && (
                <button
                  onClick={() => onSetGolden?.(task.id)}
                  title={task.isGoldenTask ? "Tarea dorada" : "Marcar como tarea dorada"}
                  className={`flex-shrink-0 text-base transition-all hover:scale-110 ${
                    task.isGoldenTask
                      ? "text-ae-signal"
                      : "text-ae-border hover:text-ae-signal"
                  }`}
                >
                  {task.isGoldenTask ? "★" : "☆"}
                </button>
              )}

              {/* Title */}
              <span
                className={`flex-1 text-sm leading-snug break-words min-w-0 ${
                  task.status === "done"
                    ? "line-through text-ae-text-muted"
                    : "text-ae-text"
                }`}
              >
                {task.title}
              </span>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Move button */}
                <button
                  onClick={() => onMoveTask?.(task.id, targetZone)}
                  title={isSignal ? "Mover a Ruido" : "Mover a Señal"}
                  className="text-ae-text-muted hover:text-ae-signal text-xs px-1.5 py-1 rounded hover:bg-ae-surface transition-colors"
                >
                  {isSignal ? "→ Ruido" : "→ Señal"}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onRemoveTask?.(task.id)}
                  title="Eliminar tarea"
                  className="text-ae-text-muted hover:text-ae-danger text-sm px-1.5 py-1 rounded hover:bg-ae-surface transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

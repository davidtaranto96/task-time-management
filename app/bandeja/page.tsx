"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTaskStore } from "@/store/taskStore"
import { useSettingsStore } from "@/store/settingsStore"
import { CERO_RUIDO_HOUR } from "@/lib/taskRules"
import TaskCard from "@/components/bandeja/TaskCard"
import MuskTimer from "@/components/bandeja/MuskTimer"
import CeroRuidoToggle from "@/components/bandeja/CeroRuidoToggle"
import type { Task } from "@/types/task"

export default function BandejaPage() {
  const {
    loadToday,
    isLoaded,
    getActiveTasks,
    completeTask,
    deferTask,
    delegateTask,
    deleteTask,
    tasks,
  } = useTaskStore()
  const { ceroRuidoEnabled, toggleCeroRuido } = useSettingsStore()

  const [muskTask, setMuskTask] = useState<Task | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    done: true,
    deferred: true,
    delegated: true,
  })

  useEffect(() => {
    loadToday()
  }, [])

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ae-bg flex items-center justify-center">
        <div className="text-ae-text-muted text-sm animate-pulse">Cargando bandeja...</div>
      </div>
    )
  }

  const allTasks = Object.values(tasks)

  // Active tasks: pending or in_progress, not deleted
  const activeTasks = allTasks.filter(
    (t) => (t.status === "pending" || t.status === "in_progress") && t.status !== "deleted"
  )

  // Cero Ruido filter: hide noise tasks before noon
  const isMorning = new Date().getHours() < CERO_RUIDO_HOUR
  const shouldHideNoise = ceroRuidoEnabled && isMorning
  const visibleActiveTasks = shouldHideNoise
    ? activeTasks.filter((t) => t.zone === "signal")
    : activeTasks

  const doneTasks = allTasks.filter((t) => t.status === "done")
  const deferredTasks = allTasks.filter((t) => t.status === "deferred")
  const delegatedTasks = allTasks.filter((t) => t.status === "delegated")

  const handleMuskComplete = async () => {
    if (!muskTask) return
    await completeTask(muskTask.id)
    setMuskTask(null)
  }

  const handleMuskStop = async () => {
    if (!muskTask) return
    await deferTask(muskTask.id)
    setMuskTask(null)
  }

  const CollapsibleSection = ({
    id,
    title,
    tasks: sectionTasks,
  }: {
    id: string
    title: string
    tasks: Task[]
  }) => {
    const collapsed = collapsedSections[id] ?? false
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wide">
            {title}{" "}
            <span className="text-ae-noise font-normal normal-case">({sectionTasks.length})</span>
          </h2>
          <span className="text-ae-text-muted text-xs">{collapsed ? "▶" : "▼"}</span>
        </button>
        {!collapsed && (
          <div className="flex flex-col gap-2">
            {sectionTasks.length === 0 ? (
              <p className="text-xs text-ae-text-muted px-1">Ninguna.</p>
            ) : (
              sectionTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDo={() => completeTask(task.id)}
                  onDelegate={(to) => delegateTask(task.id, to)}
                  onDefer={(date) => deferTask(task.id, date)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Musk Timer modal */}
      {muskTask && (
        <MuskTimer
          taskTitle={muskTask.title}
          onComplete={handleMuskComplete}
          onStop={handleMuskStop}
        />
      )}

      <div className="min-h-screen bg-ae-bg text-ae-text">
        <div className="max-w-2xl mx-auto w-full py-6 px-4 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/bunker"
                className="text-ae-text-muted hover:text-ae-text transition-colors text-lg"
                aria-label="Volver al Bunker"
              >
                ←
              </Link>
              <h1 className="text-xl font-bold text-ae-text tracking-tight">📭 Bandeja de Pateo</h1>
            </div>
          </div>

          {/* Cero Ruido Toggle */}
          <CeroRuidoToggle enabled={ceroRuidoEnabled} onToggle={toggleCeroRuido} />

          {/* Cero Ruido banner */}
          {shouldHideNoise && (
            <div className="bg-ae-accent/10 border border-ae-accent/30 rounded-xl px-4 py-3">
              <p className="text-ae-accent text-sm font-medium">
                🔕 Zona Ruido oculta hasta las 12:00 PM
              </p>
            </div>
          )}

          {/* Active Tasks */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ae-text-muted uppercase tracking-wide">
              🔥 Tareas Activas{" "}
              <span className="text-ae-noise font-normal normal-case">
                ({visibleActiveTasks.length})
              </span>
            </h2>

            {visibleActiveTasks.length === 0 ? (
              <div className="bg-ae-surface border border-ae-border rounded-xl p-6 text-center">
                <p className="text-ae-text-muted text-sm">
                  ¡Todo bajo control! No hay tareas pendientes.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {visibleActiveTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-1">
                    <TaskCard
                      task={task}
                      onDo={() => completeTask(task.id)}
                      onDelegate={(to) => delegateTask(task.id, to)}
                      onDefer={(date) => deferTask(task.id, date)}
                      onDelete={() => deleteTask(task.id)}
                    />
                    {/* Musk Mode button for noise tasks */}
                    {task.zone === "noise" && (
                      <button
                        onClick={() => setMuskTask(task)}
                        className="self-start text-xs font-semibold text-ae-signal bg-ae-signal/10 border border-ae-signal/20 hover:bg-ae-signal/20 px-3 py-1 rounded-full transition-all"
                      >
                        ⚡ 5 min MUSK
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-ae-border" />

          {/* Collapsible sections */}
          <div className="flex flex-col gap-4">
            <CollapsibleSection id="done" title="✓ Completadas" tasks={doneTasks} />
            <CollapsibleSection id="deferred" title="⏳ Pospuestas" tasks={deferredTasks} />
            <CollapsibleSection id="delegated" title="👥 Delegadas" tasks={delegatedTasks} />
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-2 border-t border-ae-border">
            <Link
              href="/bunker"
              className="text-ae-text-muted hover:text-ae-text text-sm transition-colors"
            >
              ← Volver
            </Link>
            <Link
              href="/dashboard"
              className="text-ae-text-muted hover:text-ae-text text-sm transition-colors"
            >
              Ver Dashboard →
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}

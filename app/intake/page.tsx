"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTaskStore } from "@/store/taskStore"
import GoldenQuestion from "@/components/intake/GoldenQuestion"
import TaskInput from "@/components/intake/TaskInput"
import ZoneCard from "@/components/intake/ZoneCard"
import DecisionFatigue from "@/components/intake/DecisionFatigue"

export default function IntakePage() {
  const {
    loadToday,
    addTask,
    moveToSignal,
    moveToNoise,
    setGoldenTask,
    removeTask,
    setGoldenQuestion,
    getSignalTasks,
    getNoiseTasks,
    wouldTriggerFatigue,
    isLoaded,
    dailyPlan,
  } = useTaskStore()

  const [goldenAnswer, setGoldenAnswer] = useState("")
  const [isQuestionConfirmed, setIsQuestionConfirmed] = useState(false)
  const [showFatigueAlert, setShowFatigueAlert] = useState(false)
  const [pendingTaskTitle, setPendingTaskTitle] = useState<string | null>(null)

  useEffect(() => {
    loadToday()
  }, [loadToday])

  // Restore golden question from persisted plan
  useEffect(() => {
    if (isLoaded && dailyPlan?.goldenQuestion) {
      setGoldenAnswer(dailyPlan.goldenQuestion)
      setIsQuestionConfirmed(true)
    }
  }, [isLoaded, dailyPlan?.goldenQuestion])

  const signalTasks = getSignalTasks()
  const noiseTasks = getNoiseTasks()
  const hasSignalTask = signalTasks.length > 0

  const todayLabel = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleConfirmQuestion = async () => {
    if (!goldenAnswer.trim()) return
    await setGoldenQuestion(goldenAnswer.trim())
    setIsQuestionConfirmed(true)
  }

  const handleAddTask = async (title: string) => {
    // Always add to noise first
    await addTask({ title, zone: "noise" })
  }

  const handleMoveTask = async (taskId: string, targetZone: "signal" | "noise") => {
    if (targetZone === "signal") {
      if (wouldTriggerFatigue()) {
        setPendingTaskTitle(taskId)
        setShowFatigueAlert(true)
        return
      }
      await moveToSignal(taskId)
    } else {
      await moveToNoise(taskId)
    }
  }

  const handleFatigueConfirm = async () => {
    if (pendingTaskTitle) {
      await moveToSignal(pendingTaskTitle)
    }
    setShowFatigueAlert(false)
    setPendingTaskTitle(null)
  }

  const handleFatigueCancel = () => {
    setShowFatigueAlert(false)
    setPendingTaskTitle(null)
  }

  const handleSetGolden = async (taskId: string) => {
    await setGoldenTask(taskId)
  }

  const handleRemoveTask = async (taskId: string) => {
    await removeTask(taskId)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ae-bg flex items-center justify-center">
        <div className="text-ae-text-muted text-sm animate-pulse">
          Cargando plan del día...
        </div>
      </div>
    )
  }

  return (
    <>
      <DecisionFatigue
        show={showFatigueAlert}
        onConfirm={handleFatigueConfirm}
        onCancel={handleFatigueCancel}
      />

      <div className="min-h-screen bg-ae-bg text-ae-text">
        <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-ae-text tracking-tight mb-1">
              🎯 Filtro de Decisiones
            </h1>
            <p className="text-ae-text-muted text-sm capitalize">{todayLabel}</p>
          </div>

          {/* Golden Question */}
          <GoldenQuestion
            answer={goldenAnswer}
            onChange={setGoldenAnswer}
            onConfirm={handleConfirmQuestion}
            isConfirmed={isQuestionConfirmed}
          />

          {/* Task Input */}
          <TaskInput
            onAdd={handleAddTask}
            disabled={false}
          />

          {/* Zone Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ZoneCard
              zone="signal"
              tasks={signalTasks}
              maxTasks={2}
              onMoveTask={handleMoveTask}
              onSetGolden={handleSetGolden}
              onRemoveTask={handleRemoveTask}
            />
            <ZoneCard
              zone="noise"
              tasks={noiseTasks}
              onMoveTask={handleMoveTask}
              onRemoveTask={handleRemoveTask}
            />
          </div>

          {/* CTA — Ir al Bunker */}
          <div className="flex justify-center pt-2">
            {hasSignalTask ? (
              <Link
                href="/bunker"
                className="bg-ae-signal text-ae-bg font-bold text-base px-10 py-4 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-ae-signal/30"
              >
                Ir al Bunker →
              </Link>
            ) : (
              <button
                disabled
                title="Agrega al menos una tarea en Zona Señal para continuar"
                className="bg-ae-surface border border-ae-border text-ae-text-muted font-bold text-base px-10 py-4 rounded-xl opacity-40 cursor-not-allowed"
              >
                Ir al Bunker →
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

"use client"

import { useState, useEffect, useCallback } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { useJournalStore } from '@/store/journalStore'
import { Toast } from '@/components/shared/Toast'
import type { MoodLevel, JournalEntry } from '@/types/journal'

const MOODS: { emoji: string; label: string; value: MoodLevel }[] = [
  { emoji: '😫', label: 'Terrible', value: 1 },
  { emoji: '😕', label: 'Mal', value: 2 },
  { emoji: '😐', label: 'Regular', value: 3 },
  { emoji: '🙂', label: 'Bien', value: 4 },
  { emoji: '😊', label: 'Excelente', value: 5 },
]

function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function formatDate(dayId: string): string {
  const [year, month, day] = dayId.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function EntryCard({
  entry,
  onDelete,
  onEdit,
}: {
  entry: JournalEntry
  onDelete: (dayId: string) => void
  onEdit: (entry: JournalEntry) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const moodInfo = entry.mood ? MOODS.find((m) => m.value === entry.mood) : null

  return (
    <div className="bg-ae-surface rounded-xl p-4 border border-ae-border">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-ae-text font-medium capitalize text-sm">
          {formatDate(entry.dayId)}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {moodInfo && (
            <span className="text-xl" title={moodInfo.label}>
              {moodInfo.emoji}
            </span>
          )}
          <button
            onClick={() => onEdit(entry)}
            className="text-ae-text-muted hover:text-ae-primordial transition-colors p-1"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(entry.dayId)}
                className="text-xs bg-ae-danger text-white px-2 py-1 rounded-lg"
              >
                Sí
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs bg-ae-surface-2 text-ae-text-muted px-2 py-1 rounded-lg border border-ae-border"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-ae-text-muted hover:text-ae-danger transition-colors p-1"
              title="Borrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          )}
        </div>
      </div>

      {entry.gratitude && (
        <p className="text-ae-text-muted text-sm mb-3 line-clamp-2">
          {expanded ? entry.gratitude : entry.gratitude.slice(0, 60) + (entry.gratitude.length > 60 ? '…' : '')}
        </p>
      )}

      {expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t border-ae-border">
          {entry.lessonsLearned && (
            <div>
              <p className="text-ae-text-muted text-xs mb-1">Aprendizaje</p>
              <p className="text-ae-text text-sm">{entry.lessonsLearned}</p>
            </div>
          )}
          {entry.tomorrowFocus && (
            <div>
              <p className="text-ae-text-muted text-xs mb-1">Enfoque para mañana</p>
              <p className="text-ae-text text-sm">{entry.tomorrowFocus}</p>
            </div>
          )}
          {entry.reflection && (
            <div>
              <p className="text-ae-text-muted text-xs mb-1">Reflexión</p>
              <p className="text-ae-text text-sm">{entry.reflection}</p>
            </div>
          )}
          {!entry.lessonsLearned && !entry.tomorrowFocus && !entry.reflection && (
            <p className="text-ae-text-muted text-sm italic">Sin detalles adicionales.</p>
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-xs text-ae-primordial font-medium"
      >
        {expanded ? 'Ocultar detalle ↑' : 'Ver detalle ↓'}
      </button>
    </div>
  )
}

function HistorialTab({
  onEdit,
  onDelete,
}: {
  onEdit: (entry: JournalEntry) => void
  onDelete: (dayId: string) => void
}) {
  const { getAllEntries, deleteEntry } = useJournalStore()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(() => {
    setLoading(true)
    getAllEntries().then((all) => {
      setEntries(all)
      setLoading(false)
    })
  }, [getAllEntries])

  useEffect(() => {
    reload()
  }, [reload])

  const handleDelete = async (dayId: string) => {
    await deleteEntry(dayId)
    setEntries((prev) => prev.filter((e) => e.dayId !== dayId))
    onDelete(dayId)
  }

  if (loading) {
    return <p className="text-ae-text-muted text-sm mt-6 text-center">Cargando...</p>
  }

  if (entries.length === 0) {
    return (
      <div className="mt-10 text-center px-4">
        <p className="text-ae-text-muted text-sm">
          Todavía no hay revisiones. ¡Completá tu primera revisión hoy!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {entries.map((entry) => (
        <EntryCard
          key={entry.dayId}
          entry={entry}
          onDelete={handleDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

export default function RevisionPage() {
  const [activeTab, setActiveTab] = useState<'hoy' | 'historial'>('hoy')
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const { tasks, loadToday, deferTask, deleteTask, todayId } = useTaskStore()
  const { todayEntry, loadEntry, saveEntry } = useJournalStore()

  const [customDates, setCustomDates] = useState<Record<string, string>>({})
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined)
  const [gratitude, setGratitude] = useState('')
  const [learned, setLearned] = useState('')
  const [tomorrowFocus, setTomorrowFocus] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [step3Warning, setStep3Warning] = useState(false)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)

  useEffect(() => {
    loadToday()
    loadEntry()
  }, [])

  useEffect(() => {
    if (todayEntry && !editingDayId) {
      if (todayEntry.mood) setMood(todayEntry.mood)
      if (todayEntry.gratitude) setGratitude(todayEntry.gratitude)
      if (todayEntry.lessonsLearned) setLearned(todayEntry.lessonsLearned)
      if (todayEntry.tomorrowFocus) setTomorrowFocus(todayEntry.tomorrowFocus)
    }
  }, [todayEntry])

  const allTasks = Object.values(tasks).filter(t => t.dayId === todayId)
  const completedTasks = allTasks.filter(t => t.status === 'done')
  const pendingTasks = allTasks.filter(t => t.status !== 'done' && t.status !== 'deleted' && t.status !== 'deferred')

  const isStep3Empty = mood === undefined && !gratitude.trim() && !learned.trim() && !tomorrowFocus.trim()

  const handleSaveReflection = async () => {
    await saveEntry({ mood, gratitude, lessonsLearned: learned, tomorrowFocus })
  }

  const handleDeferToCustomDate = async (id: string) => {
    const date = customDates[id]
    if (date) await deferTask(id, date)
  }

  const handleStep3Next = async () => {
    if (isStep3Empty) {
      setStep3Warning(true)
      return
    }
    setStep3Warning(false)
    await handleSaveReflection()
    setStep(4)
  }

  const handleFinish = async () => {
    await handleSaveReflection()
    setEditingDayId(null)
    setToastMessage('Revisión guardada')
    setActiveTab('historial')
  }

  const handleDeleteEntry = (dayId: string) => {
    if (editingDayId === dayId) {
      setEditingDayId(null)
    }
    setMood(undefined)
    setGratitude('')
    setLearned('')
    setTomorrowFocus('')
    setStep(1)
    setStep3Warning(false)
    if (dayId === todayId) {
      loadEntry()
    }
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingDayId(entry.dayId)
    setMood(entry.mood)
    setGratitude(entry.gratitude ?? '')
    setLearned(entry.lessonsLearned ?? '')
    setTomorrowFocus(entry.tomorrowFocus ?? '')
    // Load the entry into todayEntry so saveEntry updates the right record
    loadEntry(entry.dayId)
    setStep(3)
    setActiveTab('hoy')
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {toastMessage && (
        <Toast message={toastMessage} onDone={() => setToastMessage(null)} />
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-ae-surface rounded-xl p-1 border border-ae-border">
        <button
          onClick={() => setActiveTab('hoy')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'hoy'
              ? 'bg-ae-primordial text-ae-bg'
              : 'text-ae-text-muted hover:text-ae-text'
          }`}
        >
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'historial'
              ? 'bg-ae-primordial text-ae-bg'
              : 'text-ae-text-muted hover:text-ae-text'
          }`}
        >
          Historial
        </button>
      </div>

      {/* Historial tab */}
      {activeTab === 'historial' && <HistorialTab onEdit={handleEditEntry} onDelete={handleDeleteEntry} />}

      {/* Hoy tab — existing wizard */}
      {activeTab === 'hoy' && (
        <>
          {/* Step indicator */}
          <div className="mb-6">
            <p className="text-sm text-ae-text-muted mb-2">Paso {step} de {totalSteps}</p>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i + 1 <= step ? 'bg-ae-primordial' : 'bg-ae-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Logros */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-ae-text mb-1">¿Qué lograste hoy?</h1>
              <p className="text-ae-text-muted mb-4">
                {completedTasks.length > 0
                  ? `Completaste ${completedTasks.length} tarea${completedTasks.length !== 1 ? 's' : ''} hoy`
                  : 'No completaste tareas hoy. ¡Mañana será mejor!'}
              </p>

              {completedTasks.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {completedTasks.map(task => (
                    <li key={task.id} className="flex items-start gap-3 bg-ae-surface rounded-xl p-3">
                      <span className="text-ae-success mt-0.5">✓</span>
                      <span className="text-ae-text">{task.title}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full bg-ae-primordial text-ae-bg font-semibold rounded-xl py-3 mt-2"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Step 2: Pendientes */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-ae-text mb-1">¿Qué quedó pendiente?</h1>
              <p className="text-ae-text-muted mb-4">
                {pendingTasks.length > 0
                  ? `Tenés ${pendingTasks.length} tarea${pendingTasks.length !== 1 ? 's' : ''} sin completar`
                  : 'No hay tareas pendientes. ¡Excelente!'}
              </p>

              {pendingTasks.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {pendingTasks.map(task => (
                    <li key={task.id} className="bg-ae-surface rounded-xl p-3">
                      <p className="text-ae-text mb-2">{task.title}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => deferTask(task.id, getTomorrow())}
                          className="text-xs bg-ae-surface-2 text-ae-text-muted px-3 py-1.5 rounded-lg border border-ae-border"
                        >
                          Mañana
                        </button>
                        <div className="flex gap-1">
                          <input
                            type="date"
                            value={customDates[task.id] ?? ''}
                            onChange={e => setCustomDates(p => ({ ...p, [task.id]: e.target.value }))}
                            className="text-xs bg-ae-surface-2 text-ae-text-muted px-2 py-1.5 rounded-lg border border-ae-border"
                          />
                          <button
                            onClick={() => handleDeferToCustomDate(task.id)}
                            className="text-xs bg-ae-info text-white px-3 py-1.5 rounded-lg"
                          >
                            Otra fecha
                          </button>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-xs bg-ae-danger/20 text-ae-danger px-3 py-1.5 rounded-lg"
                        >
                          Ya no importa
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setStep(3)}
                className="w-full bg-ae-primordial text-ae-bg font-semibold rounded-xl py-3 mt-2"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Step 3: Reflexión */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-ae-text mb-4">Reflexión del día</h1>

              <div className="mb-5">
                <p className="text-ae-text-muted text-sm mb-2">¿Cómo te sentís?</p>
                <div className="flex gap-3">
                  {MOODS.map(m => (
                    <button
                      key={m.value}
                      onClick={() => { setMood(m.value); setStep3Warning(false) }}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        mood === m.value ? 'bg-ae-surface-2 ring-2 ring-ae-primordial scale-110' : 'bg-ae-surface'
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-ae-text-muted text-sm mb-1">
                  ¿Por qué te sentís agradecido hoy?
                </label>
                <textarea
                  value={gratitude}
                  onChange={e => { setGratitude(e.target.value); setStep3Warning(false) }}
                  onBlur={handleSaveReflection}
                  rows={3}
                  className="w-full bg-ae-surface border border-ae-border rounded-xl px-3 py-2 text-ae-text placeholder:text-ae-text-muted resize-none"
                  placeholder="Hoy estoy agradecido por..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-ae-text-muted text-sm mb-1">
                  ¿Qué aprendiste?
                </label>
                <textarea
                  value={learned}
                  onChange={e => { setLearned(e.target.value); setStep3Warning(false) }}
                  onBlur={handleSaveReflection}
                  rows={3}
                  className="w-full bg-ae-surface border border-ae-border rounded-xl px-3 py-2 text-ae-text placeholder:text-ae-text-muted resize-none"
                  placeholder="Hoy aprendí que..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-ae-text-muted text-sm mb-1">
                  ¿En qué te vas a enfocar mañana?
                </label>
                <textarea
                  value={tomorrowFocus}
                  onChange={e => { setTomorrowFocus(e.target.value); setStep3Warning(false) }}
                  onBlur={handleSaveReflection}
                  rows={3}
                  className="w-full bg-ae-surface border border-ae-border rounded-xl px-3 py-2 text-ae-text placeholder:text-ae-text-muted resize-none"
                  placeholder="Mañana me voy a enfocar en..."
                />
              </div>

              {step3Warning && (
                <p className="text-ae-text-muted text-xs text-center mb-3">
                  Completá al menos un campo para continuar
                </p>
              )}

              <button
                onClick={handleStep3Next}
                disabled={isStep3Empty}
                className={`w-full font-semibold rounded-xl py-3 transition-colors ${
                  isStep3Empty
                    ? 'bg-ae-border text-ae-text-muted cursor-not-allowed'
                    : 'bg-ae-primordial text-ae-bg'
                }`}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Step 4: Resumen */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-bold text-ae-text mb-4">Resumen</h1>

              <div className="bg-ae-surface rounded-xl p-5 space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-ae-text-muted text-sm">Tareas completadas</span>
                  <span className="text-ae-text font-semibold">
                    {completedTasks.length} / {allTasks.filter(t => t.status !== 'deleted').length}
                  </span>
                </div>

                {mood && (
                  <div className="flex items-center justify-between">
                    <span className="text-ae-text-muted text-sm">Estado de ánimo</span>
                    <span className="text-2xl">{MOODS.find(m => m.value === mood)?.emoji}</span>
                  </div>
                )}

                {gratitude && (
                  <div>
                    <p className="text-ae-text-muted text-sm mb-1">Agradecimiento</p>
                    <p className="text-ae-text text-sm">{gratitude}</p>
                  </div>
                )}

                {learned && (
                  <div>
                    <p className="text-ae-text-muted text-sm mb-1">Aprendizaje</p>
                    <p className="text-ae-text text-sm">{learned}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-ae-success text-white font-semibold rounded-xl py-3"
              >
                Listo, buen día ✨
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

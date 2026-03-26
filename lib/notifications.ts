import type { TimerMode } from '@/types/timer'

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationsSupported()) return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function isNotificationsSupported(): boolean {
  return 'Notification' in window
}

export function sendTimerCompleteNotification(taskTitle: string, timerMode: TimerMode): void {
  if (!isNotificationsSupported() || Notification.permission !== 'granted') return

  let body: string

  if (timerMode === 'pomodoro_25' || timerMode === 'pomodoro_50') {
    body = `Completaste una sesión de trabajo profundo en: ${taskTitle}`
  } else if (timerMode === 'quick_5') {
    body = `Tiempo agotado para: ${taskTitle}. ¡Siguiente!`
  } else {
    body = 'Descanso terminado. ¡Hora de volver al trabajo!'
  }

  new Notification('⏱ Sesión completada', { body })
}

export function sendDaySuccessNotification(): void {
  if (!isNotificationsSupported() || Notification.permission !== 'granted') return

  new Notification('🏆 Día Exitoso', {
    body: 'Completaste tus tareas primordiales. Día marcado como exitoso.',
  })
}

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

// Capacitor Local Notifications support
let LocalNotificationsModule: typeof import('@capacitor/local-notifications') | null = null

async function getLocalNotifications() {
  if (LocalNotificationsModule) return LocalNotificationsModule
  try {
    LocalNotificationsModule = await import('@capacitor/local-notifications')
    return LocalNotificationsModule
  } catch {
    return null
  }
}

export async function requestLocalNotificationPermission(): Promise<boolean> {
  const mod = await getLocalNotifications()
  if (!mod) return requestNotificationPermission()
  const { LocalNotifications } = mod
  const result = await LocalNotifications.requestPermissions()
  return result.display === 'granted'
}

export async function scheduleTaskReminder(taskId: string, title: string, at: Date): Promise<void> {
  const mod = await getLocalNotifications()
  if (!mod) return
  const { LocalNotifications } = mod
  await LocalNotifications.schedule({
    notifications: [{
      id: Math.abs(taskId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 2000000,
      title: '📌 Recordatorio de tarea',
      body: title,
      schedule: { at },
      smallIcon: 'ic_stat_icon_config_sample',
      channelId: 'tasks',
    }]
  })
}

export async function scheduleDailyHabitsReminder(hour = 20, minute = 0): Promise<void> {
  const mod = await getLocalNotifications()
  if (!mod) return
  const { LocalNotifications } = mod
  await LocalNotifications.schedule({
    notifications: [{
      id: 900001,
      title: '💪 Hábitos pendientes',
      body: 'No olvides marcar tus hábitos del día',
      schedule: { on: { hour, minute } },
      smallIcon: 'ic_stat_icon_config_sample',
      channelId: 'habits',
    }]
  })
}

export async function scheduleDailyReviewReminder(hour = 21, minute = 0): Promise<void> {
  const mod = await getLocalNotifications()
  if (!mod) return
  const { LocalNotifications } = mod
  await LocalNotifications.schedule({
    notifications: [{
      id: 900002,
      title: '📝 Revisión diaria',
      body: 'Tomá 5 minutos para revisar tu día',
      schedule: { on: { hour, minute } },
      smallIcon: 'ic_stat_icon_config_sample',
      channelId: 'review',
    }]
  })
}

export async function cancelNotification(id: number): Promise<void> {
  const mod = await getLocalNotifications()
  if (!mod) return
  const { LocalNotifications } = mod
  await LocalNotifications.cancel({ notifications: [{ id }] })
}

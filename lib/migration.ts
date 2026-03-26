import { get, set, keys } from 'idb-keyval'
import type { Task } from '@/types'

const MIGRATION_VERSION_KEY = 'ae:migration:version'
const CURRENT_VERSION = 2

/**
 * Run data migration on app startup.
 * Migrates old signal/noise zone tasks to new priority system.
 */
export async function runMigrations(): Promise<void> {
  const currentVersion = (await get(MIGRATION_VERSION_KEY)) as number | undefined

  if (currentVersion === CURRENT_VERSION) return

  // Migration v1 → v2: signal/noise → priority levels
  if (!currentVersion || currentVersion < 2) {
    await migrateSignalNoiseToPriority()
  }

  await set(MIGRATION_VERSION_KEY, CURRENT_VERSION)
}

async function migrateSignalNoiseToPriority(): Promise<void> {
  const allKeys = await keys()
  const taskKeys = allKeys.filter((k) => String(k).startsWith('ae:task:'))

  for (const key of taskKeys) {
    const task = (await get(key)) as Task & { zone?: string; isGoldenTask?: boolean; decisionType?: string; projectId?: string }
    if (!task) continue

    let changed = false

    // Map zone to priority if priority doesn't exist or is old format
    if (task.zone === 'signal' && !task.priority) {
      task.priority = 'primordial'
      changed = true
    } else if (task.zone === 'noise' && !task.priority) {
      task.priority = 'puede_esperar'
      changed = true
    }

    // Map isGoldenTask to primordial
    if (task.isGoldenTask === true && task.priority !== 'primordial') {
      task.priority = 'primordial'
      changed = true
    }

    // Set default priority if missing
    if (!task.priority) {
      task.priority = 'puede_esperar'
      changed = true
    }

    // Ensure subtaskIds exists
    if (!task.subtaskIds) {
      task.subtaskIds = []
      changed = true
    }

    // Map old projectId to parentProjectId
    if (task.projectId && !task.parentProjectId) {
      task.parentProjectId = task.projectId
      changed = true
    }

    if (changed) {
      await set(key, task)
    }
  }
}

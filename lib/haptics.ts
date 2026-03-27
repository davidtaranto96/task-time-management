// Haptic feedback utility — uses Capacitor on native, Web Vibration API as fallback

let HapticsModule: typeof import('@capacitor/haptics') | null = null

async function getHaptics() {
  if (HapticsModule) return HapticsModule
  try {
    HapticsModule = await import('@capacitor/haptics')
    return HapticsModule
  } catch {
    return null
  }
}

export async function hapticLight() {
  try {
    const h = await getHaptics()
    if (h) {
      await h.Haptics.impact({ style: h.ImpactStyle.Light })
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10)
    }
  } catch { /* ignore */ }
}

export async function hapticMedium() {
  try {
    const h = await getHaptics()
    if (h) {
      await h.Haptics.impact({ style: h.ImpactStyle.Medium })
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20)
    }
  } catch { /* ignore */ }
}

export async function hapticHeavy() {
  try {
    const h = await getHaptics()
    if (h) {
      await h.Haptics.impact({ style: h.ImpactStyle.Heavy })
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 10, 40])
    }
  } catch { /* ignore */ }
}

export async function hapticSuccess() {
  try {
    const h = await getHaptics()
    if (h) {
      await h.Haptics.notification({ type: h.NotificationType.Success })
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 5, 15])
    }
  } catch { /* ignore */ }
}

export async function hapticError() {
  try {
    const h = await getHaptics()
    if (h) {
      await h.Haptics.notification({ type: h.NotificationType.Error })
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 10, 50, 10, 50])
    }
  } catch { /* ignore */ }
}

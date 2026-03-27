const KEY_USER_NAME = 'ae_user_name'
const KEY_ONBOARDING_DONE = 'ae_onboarding_done'

export function getUserName(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY_USER_NAME)
}

export function setUserName(name: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_USER_NAME, name.trim())
  localStorage.setItem(KEY_ONBOARDING_DONE, 'true')
}

export function isOnboardingDone(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(KEY_ONBOARDING_DONE) === 'true'
}

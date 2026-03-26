export type AreaKey = 'trabajo' | 'personal' | 'salud' | 'estudio' | 'familia' | 'viajes' | 'proyectos'

export interface Area {
  key: AreaKey
  name: string
  color: string
  icon: string
}

export const AREAS: Record<AreaKey, Area> = {
  trabajo: { key: 'trabajo', name: 'Trabajo', color: '#3b82f6', icon: '💼' },
  personal: { key: 'personal', name: 'Personal', color: '#8b5cf6', icon: '🏠' },
  salud: { key: 'salud', name: 'Salud', color: '#10b981', icon: '🏥' },
  estudio: { key: 'estudio', name: 'Estudio', color: '#f59e0b', icon: '📚' },
  familia: { key: 'familia', name: 'Familia', color: '#ec4899', icon: '👨‍👩‍👧' },
  viajes: { key: 'viajes', name: 'Viajes', color: '#06b6d4', icon: '✈️' },
  proyectos: { key: 'proyectos', name: 'Proyectos', color: '#f97316', icon: '🚀' },
}

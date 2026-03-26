export type LifeEventType = "travel" | "medical" | "meeting" | "deadline" | "celebration" | "other"

export interface LifeEvent {
  id: string
  title: string
  description?: string
  type: LifeEventType
  eventDate: string           // ISO date string - when the event happens
  projectId?: string          // link to a strategic project
  prepTasks: PrepTask[]       // auto-generated preparation tasks
  isAllDay: boolean
  startTime?: string          // HH:mm format (if not all day)
  endTime?: string            // HH:mm format (if not all day)
  location?: string
  createdAt: string
  color: string               // UI color, defaults based on type
}

export interface PrepTask {
  id: string
  eventId: string
  title: string
  daysBeforeEvent: number     // e.g., 14 = suggest this 14 days before event
  isCompleted: boolean
  suggestedDayId?: string     // YYYY-MM-DD when this should be done
  taskId?: string             // linked to actual Task if user accepts the suggestion
}

// Default prep templates per event type
export const PREP_TEMPLATES: Record<LifeEventType, { title: string; daysBefore: number }[]> = {
  travel: [
    { title: "Revisar documentos de viaje (pasaporte, visa)", daysBefore: 14 },
    { title: "Reservar alojamiento", daysBefore: 21 },
    { title: "Hacer lista de equipaje", daysBefore: 7 },
    { title: "Confirmar transporte al aeropuerto", daysBefore: 3 },
    { title: "Preparar equipaje", daysBefore: 1 },
  ],
  medical: [
    { title: "Confirmar cita médica", daysBefore: 3 },
    { title: "Preparar documentos médicos/historial", daysBefore: 2 },
    { title: "Ayuno u otra preparación requerida", daysBefore: 1 },
  ],
  meeting: [
    { title: "Preparar agenda de la reunión", daysBefore: 2 },
    { title: "Revisar materiales relevantes", daysBefore: 1 },
  ],
  deadline: [
    { title: "Revisar estado del entregable", daysBefore: 7 },
    { title: "Sprint final de trabajo", daysBefore: 3 },
    { title: "Revisión final y ajustes", daysBefore: 1 },
  ],
  celebration: [
    { title: "Confirmar reservas/lugar", daysBefore: 7 },
    { title: "Preparar regalo o detalles", daysBefore: 3 },
  ],
  other: [
    { title: "Preparar lo necesario", daysBefore: 3 },
  ],
}

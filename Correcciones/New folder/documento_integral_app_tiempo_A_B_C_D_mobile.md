# Documento integral para continuar el desarrollo de la app
## A. Modelo de datos
## B. Flujo funcional
## C. Documento maestro de producto
## D. Arquitectura técnica
## E. Aclaración de plataforma y repo

---

# E. Aclaración importante de plataforma

La finalidad de la app es ser una **app mobile de celular**.

## Prioridad de plataformas
1. **Android primero**
2. **iPhone / iOS después**

## Enfoque recomendado
- construir con una base cross-platform,
- desarrollar y testear primero en Android,
- estabilizar lógica, UX y arquitectura,
- recién después adaptar y lanzar en iPhone.

## Stack mobile recomendado
- Expo
- React Native
- TypeScript
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Supabase

---

# A. Modelo de datos propuesto para la app de gestión de tiempo

## Entidades principales
- InboxItem
- Task
- WeeklyGoal
- Project
- Habit
- HabitLog
- FocusSession
- Review
- ReviewAnswer
- Note
- Category

## InboxItem
```ts
InboxItem {
  id: string
  content: string
  type: 'idea' | 'task' | 'project' | 'note' | 'habit' | 'undefined'
  status: 'unprocessed' | 'processed' | 'archived'
  categoryId?: string | null
  createdAt: datetime
  updatedAt: datetime
  processedAt?: datetime | null
  source: 'manual' | 'quick_capture'
}
```

## Task
```ts
Task {
  id: string
  title: string
  description?: string | null
  kind: 'priority' | 'normal' | 'weekly_goal_task' | 'project_task'
  priority: 'primordial' | 'important' | 'normal' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'deferred' | 'archived' | 'cancelled'
  date?: date | null
  dueDate?: datetime | null
  projectId?: string | null
  weeklyGoalId?: string | null
  parentTaskId?: string | null
  categoryId?: string | null
  isTodayPriority: boolean
  isWeeklyHighlighted: boolean
  completedAt?: datetime | null
  deferredTo?: date | null
  createdFromInboxId?: string | null
  orderIndex: number
  createdAt: datetime
  updatedAt: datetime
  deletedAt?: datetime | null
}
```

## WeeklyGoal
```ts
WeeklyGoal {
  id: string
  title: string
  description?: string | null
  priority: 'primordial' | 'important' | 'normal'
  status: 'pending' | 'in_progress' | 'completed' | 'archived'
  weekStartDate: date
  weekEndDate: date
  progressPercent: number
  createdAt: datetime
  updatedAt: datetime
  completedAt?: datetime | null
  deletedAt?: datetime | null
}
```

## Project
```ts
Project {
  id: string
  name: string
  description?: string | null
  status: 'active' | 'completed' | 'archived' | 'paused'
  priority: 'primordial' | 'important' | 'normal' | 'low'
  categoryId?: string | null
  color?: string | null
  targetDate?: date | null
  progressPercent: number
  createdFromInboxId?: string | null
  createdAt: datetime
  updatedAt: datetime
  completedAt?: datetime | null
  archivedAt?: datetime | null
  deletedAt?: datetime | null
}
```

## Habit
```ts
Habit {
  id: string
  name: string
  description?: string | null
  categoryId?: string | null
  icon?: string | null
  color?: string | null
  frequency: 'daily' | 'weekly' | 'custom'
  targetPerWeek?: number | null
  status: 'active' | 'archived'
  createdAt: datetime
  updatedAt: datetime
  archivedAt?: datetime | null
}
```

## HabitLog
```ts
HabitLog {
  id: string
  habitId: string
  date: date
  completed: boolean
  notes?: string | null
  createdAt: datetime
  updatedAt: datetime
}
```

## FocusSession
```ts
FocusSession {
  id: string
  taskId?: string | null
  mode: 'focus' | 'break'
  cycleIndex: number
  focusDurationMinutes: number
  breakDurationMinutes: number
  startedAt?: datetime | null
  endedAt?: datetime | null
  status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled'
  autoStartedBreak: boolean
  createdAt: datetime
  updatedAt: datetime
}
```

## Review
```ts
Review {
  id: string
  type: 'daily' | 'weekly'
  title?: string | null
  date: date
  status: 'draft' | 'completed'
  summary?: string | null
  mood?: 'bad' | 'neutral' | 'good' | 'great' | null
  createdAt: datetime
  updatedAt: datetime
  completedAt?: datetime | null
  deletedAt?: datetime | null
}
```

## ReviewAnswer
```ts
ReviewAnswer {
  id: string
  reviewId: string
  stepKey: string
  question: string
  answer?: string | null
  createdAt: datetime
  updatedAt: datetime
}
```

## Note
```ts
Note {
  id: string
  title?: string | null
  content: string
  kind: 'note' | 'idea' | 'memory' | 'journal'
  categoryId?: string | null
  createdFromInboxId?: string | null
  pinned: boolean
  archived: boolean
  createdAt: datetime
  updatedAt: datetime
  archivedAt?: datetime | null
}
```

## Category
```ts
Category {
  id: string
  name: string
  type: 'personal' | 'work' | 'health' | 'study' | 'family' | 'custom'
  color?: string | null
  icon?: string | null
  createdAt: datetime
  updatedAt: datetime
}
```

## Reglas de negocio importantes
- Una tarea no debe duplicarse entre pantallas.
- Si cambia la fecha, cambia su vista; no se copia.
- Una tarea de proyecto puede verse en Proyecto, Hoy y Semana.
- Las prioridades del día son tareas con `isTodayPriority = true`.
- “Lo primordial de la semana” debe usar `WeeklyGoal`.
- Inbox no obliga a convertir todo en tarea.

---

# B. Flujo funcional de todas las pantallas

## Flujo general
```text
Inbox
→ capturo algo rápido
→ lo proceso y lo convierto en:
   - tarea
   - proyecto
   - hábito
   - nota
```

## Hoy
Objetivo: mostrar qué hacer hoy, qué ya se hizo y qué queda.

### Estructura
1. Header con fecha
2. Progreso general
3. Prioridades del día
4. Tareas del día
5. Hábitos
6. Completadas hoy
7. CTA de revisión diaria

### Prioridades
Cada prioridad debe permitir:
- completar
- editar
- borrar
- diferir
- cambiar prioridad
- sacar de prioridades

### Diferir
Debe:
- mover a mañana u otra fecha
- quitarla de Hoy
- mostrarla en Semana

## Semana
Objetivo: mini calendario semanal.

### Estructura
1. Header de semana
2. Días de la semana
3. Resumen del día seleccionado
4. Tareas del día seleccionado
5. Proyectos activos relacionados
6. Lo primordial de la semana

### Al tocar un día
Mostrar:
- lista de tareas de ese día
- agregar nueva tarea
- editar existentes

### Lo primordial de la semana
No usar 3 inputs fijos.
Usar botón “Agregar meta semanal” y metas editables.

## Inbox
Objetivo: captura rápida.

### Procesar
Opciones:
- Tarea
- Proyecto
- Nota
- Idea
- Hábito

Inbox también debe servir como:
- anotador
- ayuda memoria
- ideas rápidas

## Proyectos
- nombre obligatorio al crear
- no debe crashear si falta
- tareas con prioridad, fecha opcional y categoría
- filtros: activos, completados, archivados

## Enfoque
Flujo estilo Windows:
1. elegir tarea
2. elegir duración 25/50/90
3. iniciar foco
4. terminar foco
5. iniciar descanso automático
6. ofrecer nueva ronda o volver

## Hábitos
Cada hábito debe permitir:
- marcar
- desmarcar
- editar
- archivar

## Revisión
- diaria y semanal
- no permitir completar todo vacío
- al terminar: guardar y llevar al historial
- historial editable y borrable

## Barra de navegación
1. Hoy
2. Semana
3. Inbox
4. Enfoque
5. Más

---

# C. Documento maestro de producto

## Visión del producto
La app es un sistema de productividad personal que combina:
- planificación diaria
- planificación semanal
- captura rápida
- ejecución enfocada
- hábitos
- proyectos
- reflexión

No es solo un gestor de tareas.

## Principio clave
Una sola fuente de verdad: la TAREA.

## Flujo central del usuario
```text
Capturo → Organizo → Ejecuto → Reviso → Mejoro
```

## Pilares del producto
- simplicidad
- claridad
- continuidad
- control
- progreso

## Estructura del producto
- Hoy = ejecución diaria
- Semana = planificación semanal
- Inbox = captura
- Proyectos = estructura
- Enfoque = trabajo profundo
- Hábitos = consistencia
- Revisión = mejora
- Dashboard = visión global

## Reglas de diseño críticas
- Todo elemento interactivo debe funcionar
- No duplicar acciones
- No usar placeholders fijos
- Todo debe ser editable
- Nada debe perderse

## Sistema de prioridad
- Primordial
- Importante
- Normal

Nunca hardcodear “Importante”.

## Flujos críticos no negociables
- diferir tarea
- crear tarea futura
- completar tarea
- procesar inbox
- revisión con validación e historial

## Errores actuales a corregir
- botones que no hacen nada
- duplicación de acciones
- tareas que se pierden
- contador incorrecto
- semana no funcional
- proyectos que rompen la app
- enfoque incompleto
- inbox limitado
- revisión sin validación

## Roadmap sugerido
### Fase 1
- lógica Task
- sincronización Hoy/Semana
- diferir
- contadores
- botones falsos

### Fase 2
- Semana real
- Inbox con tipos
- proyectos funcionales

### Fase 3
- enfoque estilo Windows
- revisión con historial

### Fase 4
- dashboard
- animaciones
- polish

---

# D. Arquitectura técnica

## Objetivo técnico
La app necesita una arquitectura consistente donde todas las vistas lean la misma fuente de verdad.
La entidad central debe ser `Task`.

## Arquitectura general recomendada
Capas:
- UI Layer
- State Layer
- Domain Layer
- Data Layer

Stack sugerido:
- React Native + Expo
- TypeScript
- Zustand o Redux Toolkit
- TanStack Query
- React Hook Form
- Zod
- Supabase

Recomendación:
- Expo + React Native + TypeScript + Zustand + TanStack Query + React Hook Form + Zod + Supabase

## Estructura de carpetas
```text
src/
  app/
    navigation/
    providers/
    theme/
  screens/
    today/
    week/
    inbox/
    focus/
    more/
    projects/
    habits/
    review/
    dashboard/
  components/
    common/
    tasks/
    habits/
    projects/
    reviews/
    focus/
    inbox/
    weekly-goals/
  domain/
    entities/
    use-cases/
    services/
    validators/
    rules/
  store/
    slices/
    selectors/
    actions/
  data/
    repositories/
    mappers/
    api/
    local/
  hooks/
  utils/
  constants/
  types/
  tests/
```

## Reglas técnicas
- una sola fuente de verdad
- entidades normalizadas
- selectores derivados
- validación real de formularios
- mutaciones optimistas para acciones rápidas
- tests de dominio y de integración

---

# Recomendación para el repo

## Estructura sugerida
```text
/docs
  /product
  /architecture
  /flows
/src
README.md
```

## Documentos mínimos a subir
- este documento integral
- arquitectura técnica
- backlog funcional/correcciones
- README del proyecto

## Repo actual
URL detectada:
`https://github.com/davidtaranto96/task-time-management.git`

## Comandos para subir cambios si ya tenés el repo local
```bash
git add .
git commit -m "docs: add product, flows, data model and technical architecture"
git push origin main
```

## Si recién inicializás el repo
```bash
git init
git branch -M main
git remote add origin https://github.com/davidtaranto96/task-time-management.git
git add .
git commit -m "Initial product and architecture docs"
git push -u origin main
```

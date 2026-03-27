# Arquitectura técnica propuesta
## App de gestión de tiempo / productividad personal
## Enfoque mobile-first: Android primero, iPhone después

## 1. Objetivo técnico
La app necesita pasar de “pantallas lindas con lógica suelta” a una arquitectura consistente donde:
- todas las vistas lean la misma fuente de verdad,
- las tareas no se dupliquen,
- mover, completar, editar o diferir una tarea impacte en todas las pantallas,
- Inbox, Hoy, Semana, Proyectos, Enfoque, Hábitos y Revisión compartan reglas claras,
- el desarrollo arranque orientado a **mobile**, priorizando **Android**,
- iPhone/iOS quede como segunda etapa, reutilizando la misma base.

La entidad central debe ser `Task`.

---

## 2. Estrategia de plataforma

### Fase 1: Android
Objetivo:
- lanzar primero una versión estable para Android,
- validar lógica, UX y arquitectura,
- detectar bugs reales de uso,
- iterar rápido.

### Fase 2: iPhone / iOS
Objetivo:
- reutilizar la mayor parte posible del dominio, estado, componentes y data layer,
- adaptar diferencias de UI/UX, navegación, performance y permisos si hiciera falta.

### Recomendación
Hacer la app con una base **cross-platform mobile**, pero diseñando y testeando primero en Android.

La mejor opción práctica para esto es:
- **React Native + Expo**
o
- **React Native bare** si después necesitás más control nativo.

Para tu caso, recomiendo:
- **Expo + React Native + TypeScript**

Porque te deja:
- salir rápido en Android,
- mantener una sola base,
- migrar luego a iPhone sin rehacer todo.

---

## 3. Arquitectura general recomendada

### Frontend por capas
- **UI Layer**: pantallas, componentes, modales, cards, tabs
- **State Layer**: store global + estado derivado por vistas
- **Domain Layer**: lógica de negocio pura
- **Data Layer**: repositorios / servicios que leen y escriben en backend o persistencia local

### Stack sugerido
- **React Native + Expo**
- **TypeScript**
- **Zustand** o Redux Toolkit
- **TanStack Query**
- **React Hook Form**
- **Zod**
- **Expo Router** o React Navigation
- **Supabase**
- Persistencia local opcional: **MMKV** o **SQLite**

### Recomendación concreta
- Expo
- TypeScript
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Supabase

---

## 4. Capas del sistema

### UI Layer
Solo debería:
- renderizar datos,
- disparar acciones,
- mostrar carga, error, vacío,
- manejar animaciones y microinteracciones.

La UI no debería contener la lógica real de diferir, completar, procesar inbox o cerrar revisión.

### Domain Layer
Acá vive la lógica de producto:
- createTask
- updateTask
- deleteTask
- completeTask
- deferTask
- toggleTodayPriority
- createWeeklyGoal
- processInboxItem
- startFocusSession
- completeReview
- reopenProject
- archiveProject

### State Layer
Debe guardar:
- entidades normalizadas,
- filtros activos,
- semana actual,
- día seleccionado en Semana,
- sesión de enfoque activa,
- draft de revisión,
- UI state pequeño.

### Data Layer
Repositorios sugeridos:
- taskRepository
- projectRepository
- weeklyGoalRepository
- inboxRepository
- habitRepository
- reviewRepository
- focusRepository
- noteRepository
- categoryRepository

---

## 5. Estructura de carpetas sugerida

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

---

## 6. Modelo de estado recomendado

Guardar entidades por id.

```ts
type EntityState<T> = {
  byId: Record<string, T>
  allIds: string[]
}
```

### Ejemplo de store
```ts
type AppStore = {
  tasks: EntityState<Task>
  projects: EntityState<Project>
  weeklyGoals: EntityState<WeeklyGoal>
  inboxItems: EntityState<InboxItem>
  habits: EntityState<Habit>
  habitLogs: EntityState<HabitLog>
  notes: EntityState<Note>
  reviews: EntityState<Review>
  reviewAnswers: EntityState<ReviewAnswer>
  focusSessions: EntityState<FocusSession>

  selectedWeekStartDate: string
  selectedDayInWeek: string | null
  activeFocusSessionId: string | null

  ui: {
    isCreateTaskModalOpen: boolean
    isCreateProjectModalOpen: boolean
    isProcessingInbox: boolean
    activeBottomTab: 'today' | 'week' | 'inbox' | 'focus' | 'more'
  }
}
```

---

## 7. Selectores derivados
Las pantallas no deberían recorrer datos crudos todo el tiempo.

Selectores clave:
- selectTasksForToday
- selectTodayPriorities
- selectCompletedTasksForToday
- selectTasksForDate(date)
- selectWeekSummary(weekStartDate)
- selectTasksForSelectedWeekDay
- selectProjectTasks(projectId)
- selectWeeklyGoalsForWeek(weekStartDate)
- selectUnprocessedInboxItems
- selectHabitLogsForToday
- selectReviewHistory(type?)
- selectActiveFocusSession

---

## 8. Casos de uso críticos

### Crear tarea
```ts
createTask(input: CreateTaskInput): Promise<Task>
```

### Diferir tarea
```ts
deferTask(taskId: string, newDate: string): Promise<void>
```

### Completar tarea
```ts
completeTask(taskId: string): Promise<void>
```

### Procesar item de Inbox
```ts
processInboxItem(
  inboxItemId: string,
  target: 'task' | 'project' | 'habit' | 'note',
  payload: any
): Promise<void>
```

### Completar revisión
```ts
completeReview(reviewId: string, answers: ReviewAnswerInput[]): Promise<void>
```

### Iniciar enfoque
```ts
startFocusSession(input: StartFocusSessionInput): Promise<FocusSession>
```

### Reabrir proyecto
```ts
reopenProject(projectId: string): Promise<void>
```

---

## 9. Reglas de consistencia
- Una tarea existe una sola vez.
- Si cambia la fecha, cambia su vista, no se copia.
- Una tarea de proyecto con fecha puede verse en Proyecto, Semana y Hoy.
- Las prioridades del día son tareas filtradas, no otra entidad aparte.
- Las metas semanales deben ser `WeeklyGoal`, no 3 textbox visuales.
- Inbox puede derivar en tarea, proyecto, hábito o nota.
- Revisión debe guardar historial real.
- Focus debe guardar sesiones reales.

---

## 10. Backend / persistencia recomendada
### Opción práctica: Supabase
Ventajas:
- auth simple,
- Postgres,
- reglas de acceso,
- storage,
- buena integración con Expo/React Native,
- ideal para MVP y crecimiento.

### Tablas sugeridas
- tasks
- weekly_goals
- projects
- inbox_items
- habits
- habit_logs
- notes
- reviews
- review_answers
- focus_sessions
- categories

---

## 11. Navegación técnica mobile

### Bottom tabs
Orden recomendado:
1. Hoy
2. Semana
3. Inbox
4. Enfoque
5. Más

### Stack dentro de Más
- Proyectos
- Hábitos
- Revisión
- Dashboard
- Ajustes

### Navegación cruzada importante
- Hoy → Revisión diaria
- Semana → detalle de Proyecto
- Inbox → destino creado
- Revisión → Historial
- Semana → modal crear tarea con fecha preseleccionada

---

## 12. Formularios y validación
Usar React Hook Form + Zod.

Formularios críticos:
- crear proyecto
- crear tarea
- procesar inbox
- revisión diaria/semanal
- crear meta semanal
- crear hábito

### Ejemplo
```ts
const createProjectSchema = z.object({
  name: z.string().min(1, 'El nombre del proyecto es obligatorio'),
  description: z.string().optional(),
  priority: z.enum(['primordial', 'important', 'normal', 'low']),
  targetDate: z.string().optional()
})
```

---

## 13. Manejo de errores
Tres niveles:

### UI
- mensaje visible,
- no cerrar modal si hay error,
- mostrar campo inválido.

### Domain
- impedir estados inválidos,
- validar reglas del negocio.

### Data
- capturar errores de red,
- manejar retries razonables,
- evitar pérdida de datos.

Ejemplo:
si el usuario crea proyecto sin nombre:
- UI muestra error,
- el modal no se cierra,
- la app no crashea.

---

## 14. Estrategia de sincronización
Para MVP recomiendo:
- online-first,
- TanStack Query para fetch y mutations,
- Zustand para UI state,
- mutations optimistas para:
  - completar tarea,
  - diferir tarea,
  - marcar hábito,
  - procesar inbox.

Offline puede venir después.

---

## 15. Cálculo de métricas
No guardar todo materializado al principio.

Derivar:
- tareas completadas hoy
- progreso del día
- progreso semanal
- consistencia de hábitos
- racha
- progreso de proyecto
- sesiones de enfoque del día

---

## 16. Componentes reutilizables sugeridos
- TaskItem
- TaskList
- TaskEditorModal
- PriorityBadge
- WeekHeader
- WeekDaySelector
- WeekDayCard
- WeekTaskPanel
- InboxCaptureBox
- InboxItemCard
- InboxProcessModal
- ProjectCard
- ProjectEditorModal
- ReviewStep
- ReviewHistoryList
- FocusTimer
- FocusTaskPicker
- FocusSessionControls

---

## 17. UX técnica / animaciones
Como es mobile, conviene usar:
- **Reanimated** para animaciones importantes
- microinteracciones cortas y consistentes

Animaciones ideales:
- completar tarea,
- mover entre listas,
- transición entre tabs,
- cambio foco → descanso,
- expandir historial,
- toast de feedback.

---

## 18. Testing recomendado

### Unit tests
- createTask
- deferTask
- completeTask
- processInboxItem
- completeReview

### Integration tests
- Hoy ↔ Semana
- Inbox → Task/Note/Project
- Proyecto → Task con fecha
- Revisión → Historial

### UI tests
- crear proyecto sin nombre no crashea
- diferir mueve tarea
- completar actualiza contador
- historial de revisión editable
- semana muestra tareas futuras

---

## 19. Orden de implementación técnica

### Fase 1: base estable
- modelo de datos real
- tablas / repositorios
- store global
- CRUD de Task
- selectores Hoy y Semana
- validaciones

### Fase 2: sincronización core
- diferir tarea
- completar tarea
- prioridades del día
- semana funcional tipo calendario
- weekly goals dinámicas

### Fase 3: módulos extendidos
- Inbox con tipos
- Proyectos conectados
- Hábitos con logs
- Revisión con historial

### Fase 4: enfoque y polish
- Focus estilo Windows
- animaciones
- dashboard
- optimización UX
- soporte iPhone

---

## 20. Decisión técnica más importante
No modelar cada pantalla como si fuera un sistema distinto.

La arquitectura debe ser:

Entidades únicas  
→ lógica única  
→ vistas distintas

No:
- Hoy con su propia lista aislada,
- Semana con otra,
- Proyecto con otra.

---

## 21. Recomendación para el repo
Estructura sugerida inicial:
- `/docs` para todos estos documentos
- `/src` para la app
- `/README.md` con visión del proyecto
- `/docs/product`
- `/docs/architecture`
- `/docs/flows`

Eso te va a ordenar muchísimo el trabajo con Claude y con cualquier dev.

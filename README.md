# Arquitectura de Enfoque

Sistema personal de organización, priorización y enfoque. Reemplaza libretas físicas y notas dispersas con un flujo digital integrado.

## Funcionalidades

- **Hoy** — Prioridades del día (máximo 3 primordiales), tareas secundarias, hábitos
- **Semana** — Calendario semanal con tareas por día, metas semanales dinámicas
- **Inbox** — Captura rápida de ideas, notas, tareas y proyectos
- **Enfoque** — Modo focus con Pomodoro (25/50/90 min), sesiones encadenadas con breaks automáticos
- **Proyectos** — Gestión de proyectos con subtareas, categorías y progreso
- **Hábitos** — Tracker diario/semanal con rachas y vista de 7 días
- **Revisión** — Wizard de reflexión diaria con historial editable
- **Dashboard** — Estadísticas de productividad y progreso

## Stack técnico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (tema oscuro con tokens `ae-*`)
- **Estado:** Zustand 5 con persist middleware
- **Persistencia:** IndexedDB via idb-keyval (prefijo `ae:`)
- **Sin backend** — Todo corre en el navegador del usuario

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

El servidor corre en `http://localhost:3000`.

## Estructura del proyecto

```
app/            → Páginas (hoy, inbox, semana, enfoque, proyectos, habitos, revision, dashboard, mas)
components/     → Componentes React organizados por feature
store/          → Zustand stores (taskStore, timerStore, habitStore, etc.)
lib/            → Lógica de negocio, persistencia, utilidades
types/          → Interfaces TypeScript
```

## Sistema de prioridades

- **Primordial** — Máximo 3 por día, lo más importante
- **Importante** — Tareas relevantes pero no críticas
- **Puede esperar** — Tareas diferibles

## Acciones 4D para tareas

- **Do** — Hacerla ahora
- **Delegate** — Asignarla
- **Defer** — Moverla a otra fecha
- **Delete** — Eliminarla

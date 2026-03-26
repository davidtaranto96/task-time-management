# BACKLOG DE DESARROLLO - APP DE GESTIÓN DE TIEMPO

Formato:  
- Tipo: BUG / MEJORA / UX  
- Prioridad: Alta / Media / Baja  
- Descripción  
- Resultado esperado  

---

## 1. VISTA HOY

### 1.1 Contador incorrecto al borrar tareas
- Tipo: BUG  
- Prioridad: Alta  
- Descripción: Al eliminar una tarea, el contador de prioridades no se actualiza correctamente.  
- Resultado esperado: El contador (ej: 2/3) y el porcentaje deben recalcularse automáticamente.

---

### 1.2 Botón “Diferir” no funcional
- Tipo: BUG  
- Prioridad: Alta  
- Descripción: El botón “Diferir” no ejecuta ninguna acción.  
- Resultado esperado: Debe mover la tarea a otra fecha (mínimo mañana) y reflejarse en Semana.

---

### 1.3 Botón “Agregar prioridad” no funciona
- Tipo: BUG  
- Prioridad: Alta  
- Descripción: El botón visible no responde, solo funciona el botón flotante.  
- Resultado esperado: Ambos deben permitir crear prioridad o unificarse en uno solo funcional.

---

### 1.4 Estado vacío engañoso
- Tipo: UX  
- Prioridad: Media  
- Descripción: “Elegí tus 3 prioridades” parece clickable pero no lo es.  
- Resultado esperado: O se vuelve funcional o deja de parecer botón.

---

### 1.5 Falta historial del día
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: No se ve claramente lo hecho vs pendiente.  
- Resultado esperado: Sección con tareas completadas, pendientes y opción de desmarcar.

---

## 2. VISTA SEMANA

### 2.1 Orden incorrecto de secciones
- Tipo: UX  
- Prioridad: Media  
- Descripción: “Lo primordial” está antes que el calendario semanal.  
- Resultado esperado: Primero días de la semana, luego prioridades.

---

### 2.2 Días de la semana no funcionales
- Tipo: BUG  
- Prioridad: Alta  
- Descripción: Seleccionar un día no muestra tareas reales.  
- Resultado esperado: Mostrar tareas completas de ese día.

---

### 2.3 Tareas pospuestas se pierden
- Tipo: BUG  
- Prioridad: Alta  
- Descripción: Al diferir tareas desde Hoy, no aparecen en Semana.  
- Resultado esperado: Deben reflejarse correctamente en el día destino.

---

### 2.4 Tareas futuras no editables
- Tipo: MEJORA  
- Prioridad: Alta  
- Descripción: No se pueden editar tareas de otros días.  
- Resultado esperado: Permitir editar, borrar, completar y reprogramar.

---

### 2.5 “Lo primordial” sin funcionalidad
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: Es estático.  
- Resultado esperado: Permitir completar, editar, agregar subtareas y prioridad.

---

## 3. SINCRONIZACIÓN GLOBAL

### 3.1 Inconsistencia entre pantallas
- Tipo: BUG  
- Prioridad: Alta  
- Descripción: Hoy, Semana y Proyectos no comparten correctamente el estado.  
- Resultado esperado: Fuente única de verdad para tareas.

---

## 4. ENFOQUE

### 4.1 Temporizador básico
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: No hay relación entre trabajo y descanso.  
- Resultado esperado: Bloques automáticos (25/50/90 + pausas).

---

### 4.2 Sin encadenamiento automático
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: No inicia pausa automáticamente.  
- Resultado esperado: Trabajo → pausa → siguiente sesión.

---

## 5. PROYECTOS

### 5.1 Tareas sin prioridad ni fecha
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: Falta estructura en tareas.  
- Resultado esperado: Permitir prioridad, fecha y edición completa.

---

### 5.2 Proyecto no reabrible
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: No se puede reabrir proyecto completado.  
- Resultado esperado: Permitir editar y reabrir.

---

### 5.3 Archivados sin ubicación clara
- Tipo: UX  
- Prioridad: Media  
- Descripción: No se sabe dónde van.  
- Resultado esperado: Sección de proyectos archivados.

---

## 6. REVISIÓN

### 6.1 Sin historial
- Tipo: MEJORA  
- Prioridad: Alta  
- Descripción: No hay historial de revisiones.  
- Resultado esperado: Mostrar revisiones pasadas tipo bitácora.

---

## 7. INBOX

### 7.1 Falta opción de notas
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: Solo permite tareas.  
- Resultado esperado: Poder guardar ideas como notas.

---

## 8. HÁBITOS

### 8.1 Problemas visuales
- Tipo: UX  
- Prioridad: Baja  
- Descripción: Elementos desalineados o cortados.  
- Resultado esperado: Layout consistente.

---

### 8.2 No se pueden desmarcar
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: No se puede corregir error.  
- Resultado esperado: Permitir desmarcar.

---

## 9. DASHBOARD

### 9.1 Metas estáticas
- Tipo: MEJORA  
- Prioridad: Media  
- Descripción: No se pueden editar.  
- Resultado esperado: CRUD completo de metas.

---

## 10. EFECTOS Y TRANSICIONES

### 10.1 Falta de microinteracciones
- Tipo: UX  
- Prioridad: Baja  
- Descripción: Interfaz muy estática.  
- Resultado esperado:
  - hover animado,
  - click con escala,
  - check animado.

---

### 10.2 Transiciones entre pantallas
- Tipo: UX  
- Prioridad: Baja  
- Descripción: Cambios bruscos.  
- Resultado esperado:
  - fade,
  - slide suave entre tabs.

---

### 10.3 Animación al completar tareas
- Tipo: UX  
- Prioridad: Baja  
- Resultado esperado:
  - check animado,
  - fade out de la tarea.

---

### 10.4 Animación en temporizador
- Tipo: UX  
- Prioridad: Baja  
- Resultado esperado:
  - progreso fluido,
  - transición trabajo → descanso.

---

## RESUMEN FINAL

PRIORIDAD ALTA:
- Diferir tareas
- Sincronización entre vistas
- Contadores incorrectos
- Botones que no funcionan

PRIORIDAD MEDIA:
- Enfoque (pomodoro)
- Proyectos completos
- Revisión con historial
- Inbox con notas

PRIORIDAD BAJA:
- Animaciones
- UI/UX visual
- microinteracciones

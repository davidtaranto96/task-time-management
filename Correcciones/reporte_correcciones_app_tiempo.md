# Reporte completo de correcciones y mejoras para la app de gestión de tiempo

## Objetivo
Este documento resume todas las correcciones, bugs, mejoras funcionales, ajustes de UX/UI y sugerencias de transiciones/efectos detectadas durante la revisión de la app. Está redactado para pasarlo directamente a desarrollo o a Claude como base de trabajo.

---

## 1. Vista Semana

### 1.1 Reordenar la jerarquía visual
- Subir la sección **“Días de la semana”**.
- Bajar la sección **“Lo primordial de la semana”**.
- La pantalla semanal debería sentirse primero como una **vista/calendario semanal**, no como una lista estática de metas.

### 1.2 Convertir “Días de la semana” en una vista funcional
Al hacer click en un día:
- mostrar las tareas de ese día,
- mostrar tareas pendientes, completadas y pospuestas,
- permitir editar,
- permitir borrar,
- permitir completar,
- permitir reprogramar.

### 1.3 Mini calendario semanal real
La vista semanal debería funcionar como un mini calendario:
- seleccionar un día,
- ver lo asignado a ese día,
- cargar tareas nuevas para ese día,
- mover tareas entre días,
- ver reflejados cambios hechos desde la vista “Hoy”.

### 1.4 Sincronización con tareas diferidas
Si una tarea se difiere desde “Hoy” para mañana:
- debe desaparecer de “Hoy”,
- debe aparecer automáticamente en “Semana” dentro del día de mañana,
- no debe perderse.

### 1.5 “Lo primordial de la semana” no debe ser estático
Cada item debería permitir:
- completar con un click,
- editar,
- borrar,
- asignar subtareas,
- definir prioridad,
- marcar avance.

### 1.6 Metas semanales dinámicas
No mostrar 3 metas vacías fijas desde el inicio.
Mejor comportamiento:
- mostrar un primer espacio para cargar una meta,
- agregar botón **+** para sumar más metas,
- permitir completar metas semanales,
- permitir editarlas o eliminarlas.

### 1.7 Cambio de semana
Cuando se cambie de semana:
- deben actualizarse correctamente las fechas,
- deben cambiar las metas semanales,
- deben cambiar las tareas por día,
- deben actualizarse indicadores y progreso de esa semana.

---

## 2. Vista Hoy

### 2.1 Error de conteo en prioridades del día
Problema:
- si se borra una tarea, el contador de prioridades queda mal,
- el número total/completado no se recalcula bien.

Corregir para que:
- se actualice la cantidad total,
- se actualice la cantidad completada,
- se actualice el porcentaje,
- la UI refleje siempre el estado real.

### 2.2 Botón “Diferir” no funciona
Actualmente parece un botón válido pero no hace nada.

Debe permitir:
- mover la tarea a mañana o a otra fecha,
- actualizar la fecha en el sistema,
- quitar la tarea de “Hoy”,
- mostrarla en la vista “Semana” en el nuevo día.

### 2.3 Estado vacío de prioridades mal resuelto
Cuando aparece:
- “Sin prioridades aún”
- “Elegí tus 3 prioridades”

parece un botón, pero no acciona nada.

Opciones:
- hacerlo realmente funcional,
- o cambiar el diseño para que no parezca un botón.

### 2.4 Texto recomendado para el estado vacío
En vez de forzar “3 prioridades”, podría decir:
- “Elegí tu prioridad del día”
- “Agregá tus prioridades del día”

Esto da más flexibilidad si el límite de 3 no está firme.

### 2.5 Botón “Agregar prioridad” no funciona
Actualmente el botón visible “+ Agregar prioridad” no responde, mientras que el botón flotante sí parece funcionar.

Corregir:
- hacer funcional ese botón,
- o eliminarlo si el único punto de entrada será el botón flotante.

### 2.6 Mostrar historial del día
La pantalla de Hoy debería mostrar mejor:
- qué tareas ya se hicieron,
- cuáles siguen pendientes,
- cuáles se completaron,
- permitir desmarcar tareas si el usuario se equivocó.

### 2.7 Orden de secciones en Hoy
Sería mejor priorizar:
1. prioridades/tareas del día,
2. pendientes y completadas,
3. hábitos,
4. revisión o cierre del día.

### 2.8 CTA hacia revisión diaria
Al final de la pantalla Hoy podría existir un bloque como:
- “Hacer revisión del día”
y que lleve directamente a la pantalla de revisión.

---

## 3. Sincronización entre “Hoy” y “Semana”

### 3.1 Tareas pospuestas no deben perderse
Todo cambio de fecha hecho en “Hoy” debe verse automáticamente en “Semana”.

### 3.2 Tareas futuras editables
Desde Semana debería poderse:
- editar tareas futuras,
- borrarlas,
- completarlas,
- cambiarles la fecha,
- cambiarles la prioridad,
- cambiarles la categoría.

### 3.3 Categorías o tipos al crear tareas
Si creo algo para otro día, debería poder elegir si es:
- primordial,
- importante,
- casual,
- u otra categoría definida por la app.

---

## 4. Módulo Enfoque / Focus

### 4.1 Selección clara de bloques de trabajo
Permitir elegir bloques:
- 25 min,
- 50 min,
- 90 min.

### 4.2 Preselección de pausa según duración
Cuando se elige un bloque, sugerir automáticamente:
- 25 min → 5 min de pausa,
- 50 min → 10 min de pausa,
- 90 min → 15 min de pausa.

### 4.3 Encadenamiento automático
Al terminar el bloque de trabajo:
- iniciar automáticamente la pausa,
- mostrar el cambio de modo,
- al terminar la pausa, ofrecer continuar o iniciar otra sesión.

### 4.4 Asociar el foco a una tarea
Sería ideal que la sesión de enfoque pueda vincularse a una tarea real del día.

### 4.5 Mejorar feedback del temporizador
Agregar:
- animación de transición entre trabajo y descanso,
- cambio visual claro de estado,
- aviso sonoro o vibración,
- indicador de progreso circular más vivo.

---

## 5. Proyectos

### 5.1 Más opciones para tareas del proyecto
Cada tarea dentro de un proyecto debería permitir:
- prioridad,
- categoría,
- fecha opcional,
- edición,
- borrado,
- completado.

### 5.2 Reabrir proyectos completados
Cuando un proyecto se complete, debería poder:
- seguir viéndose,
- editarse,
- reabrirse si surge algo nuevo.

### 5.3 Claridad sobre archivados
Actualmente no está claro a dónde va un proyecto archivado.

Agregar:
- sección de archivados,
- filtro para ver proyectos archivados.

### 5.4 Navegación desde la vista Semana
Si en Semana hago click en un proyecto activo:
- debería abrirse el detalle del proyecto.

### 5.5 Mejoras al modal de creación de proyecto
Revisar:
- formato local de fecha (`dd/mm/yyyy` en vez de `mm/dd/yyyy` si la app está en español),
- consistencia de idioma,
- claridad en selección de color,
- validaciones de campos.

### 5.6 Completar proyecto no debería bloquear todo
Si un proyecto está marcado como completo:
- debería permitirse reabrir,
- editar notas,
- agregar una tarea nueva si hace falta.

---

## 6. Revisión

### 6.1 Historial de revisiones
La sección Revisión debería mostrar:
- historial de revisiones diarias,
- historial de revisiones semanales.

### 6.2 Qué debería incluir cada revisión
- fecha,
- tareas completadas,
- tareas pendientes,
- hábitos cumplidos,
- observaciones o notas,
- resumen del día/semana.

### 6.3 Revisión como bitácora
La idea es que funcione como una mini bitácora o diario productivo.

### 6.4 Acceso al historial desde Semana
También podría verse el historial desde la vista semanal o al menos un resumen enlazado.

---

## 7. Inbox / Procesado de ideas

### 7.1 Procesar ideas como notas
Además de convertir una idea en tarea o proyecto, debería poder:
- archivarse como nota,
- guardarse como idea simple,
- quedar en un espacio de notas.

### 7.2 Módulo de notas
Sería muy útil una sección “Notas” para:
- ideas rápidas,
- pensamientos,
- borradores,
- apuntes no accionables.

### 7.3 Claridad en el procesado
Cuando se procesa una captura, debería quedar claro si va a:
- tarea,
- proyecto,
- hábito,
- nota,
- archivo.

---

## 8. Hábitos

### 8.1 Bloque de hábitos cortado o incómodo en la vista Hoy
Revisar layout para que no quede visualmente cortado.

### 8.2 Mejorar alineación y espaciado
Revisar:
- centrado de íconos,
- textos truncados,
- espaciado entre nombre, icono y contador,
- coherencia entre hábitos marcados y no marcados.

### 8.3 Desmarcar hábitos
Permitir marcar y también desmarcar por si el usuario se equivoca.

### 8.4 Mejor consistencia en tarjetas
Las tarjetas de hábitos deberían tener estructura uniforme:
- icono,
- nombre,
- racha,
- estado,
- categoría si aplica.

---

## 9. Dashboard

### 9.1 Metas semanales interactivas
La sección “Metas semanales” no debería quedar estática.

Permitir:
- agregar metas,
- completar metas,
- editar,
- borrar.

### 9.2 No mostrar tres espacios vacíos por defecto
Misma lógica recomendada que en “Lo primordial de la semana”:
- un primer campo,
- botón para agregar más.

### 9.3 Coherencia de métricas
Verificar que los indicadores de:
- racha,
- consistencia,
- tareas por área,
- hábitos de 7 días,
- metas semanales

se actualicen en tiempo real con lo que ocurre en el resto de la app.

---

## 10. Pantalla Más

### 10.1 Revisión debería abrir historial
Cuando se ingresa a Revisión desde “Más”, sería mejor mostrar primero:
- historial reciente,
- acceso a revisión diaria,
- acceso a revisión semanal.

### 10.2 Ajustes “Próximamente”
Si Ajustes todavía no existe, conviene marcarlo visualmente como:
- “Próximamente”,
- “En desarrollo”.

Así no parece un módulo roto.

---

## 11. Problemas generales detectados

### 11.1 Hay elementos que parecen botones pero no hacen nada
Esto genera confusión en varias pantallas.

Revisar todos los CTA y confirmar que:
- o funcionan,
- o no tengan apariencia de botón.

### 11.2 Falta feedback tras acciones
Agregar feedback como:
- toast,
- mensajes breves,
- refresco inmediato de contadores,
- animación de actualización,
- confirmación de acción.

### 11.3 Posible problema de arquitectura del estado
Da la sensación de que algunas vistas no comparten una única fuente de verdad.

Conviene unificar el modelo de datos de las tareas con campos como:
- id,
- título,
- descripción,
- fecha,
- estado,
- prioridad,
- categoría,
- proyecto asociado,
- subtareas,
- historial de cambios.

Esto ayudaría a evitar:
- pérdida de tareas,
- contadores mal actualizados,
- diferencias entre Hoy y Semana,
- acciones incompletas.

---

## 12. Recomendaciones de UX/UI y efectos visuales

### 12.1 Agregar microinteracciones
Para que la app se sienta más viva:
- hover suave en tarjetas y botones,
- pequeña escala al tocar/clickear,
- transición al completar tareas,
- animación al mover tareas de un día a otro,
- check animado al completar.

### 12.2 Transiciones entre pantallas
Agregar transiciones suaves entre tabs:
- fade,
- slide horizontal leve,
- transición rápida entre Hoy / Inbox / Semana / Enfoque / Más.

### 12.3 Animaciones al expandir o mostrar contenido
Usar animaciones suaves para:
- abrir detalles de proyecto,
- mostrar tareas del día en Semana,
- desplegar historial,
- abrir formularios o modales.

### 12.4 Animación al diferir o reprogramar
Cuando una tarea se difiere:
- mostrar una transición visual que indique que se movió de fecha,
- por ejemplo, desaparecer de Hoy y aparecer luego en Semana.

### 12.5 Transiciones del temporizador
En Focus:
- animación de cambio entre trabajo y pausa,
- progreso del círculo más fluido,
- cambio de texto con fade,
- aviso visual fuerte al terminar.

### 12.6 Estados vacíos más amigables
Los estados vacíos pueden tener:
- una ilustración simple,
- una animación mínima,
- un CTA realmente funcional.

### 12.7 Mejor jerarquía visual
Reforzar con:
- espaciados más claros,
- títulos con mejor separación,
- bloques con aire,
- indicadores de selección más evidentes.

### 12.8 Consistencia de color y movimiento
Mantener una misma lógica visual:
- amarillo para prioridad/foco/acción principal,
- verde para completado,
- gris para inactivo,
- animaciones cortas y consistentes en todas las pantallas.

---

## 13. Prioridades sugeridas para desarrollo

### Prioridad alta
1. Arreglar botones que no hacen nada.
2. Corregir el contador de prioridades al borrar tareas.
3. Implementar correctamente “Diferir”.
4. Evitar que tareas pospuestas se pierdan.
5. Hacer funcional la vista semanal como mini calendario.
6. Permitir editar/completar/borrar tareas futuras.
7. Sincronizar correctamente Hoy, Semana y Proyectos.

### Prioridad media
1. Mejorar Focus con bloques y pausas automáticas.
2. Hacer funcional “Lo primordial de la semana”.
3. Mejorar la gestión de proyectos y archivados.
4. Crear historial real de revisión.
5. Permitir guardar ideas como notas.

### Prioridad baja / mejora visual
1. Reordenar jerarquías visuales.
2. Mejorar estados vacíos.
3. Agregar microinteracciones.
4. Agregar transiciones entre pantallas.
5. Mejorar alineación, espaciado y consistencia visual.

---

## 14. Resumen final
La app tiene una base visual atractiva, pero necesita fortalecer la lógica de interacción y la consistencia del estado entre pantallas. Lo más importante no es solo agregar funciones nuevas, sino asegurar que las acciones básicas funcionen bien: crear, editar, borrar, completar, diferir y ver correctamente cada tarea según su fecha y contexto. Una vez resuelto eso, sumar transiciones, microanimaciones y feedback visual puede elevar mucho la calidad percibida del producto.

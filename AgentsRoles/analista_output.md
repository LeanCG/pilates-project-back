# Historias de Usuario - Sistema de Gestión de Pilates

Basado en el análisis del código actual y los requerimientos del negocio.

---

## 1) Mapa Funcional

### Módulo: Autenticación y Cuentas
- [x] Login
- [x] Registro de cliente
- [ ] Recuperar contraseña

### Módulo: Gestión de Clientes
- [x] Alta y edición
- [ ] Afecciones físicas (campo nuevo)
- [ ] Estados completos (activo/baja/moroso)
- [ ] Planes (mensual 2/3/casual)
- [ ] Historial completo

### Módulo: Gestión de Empleados/Instructores
- [ ] CRUD empleados
- [ ] Asignación a turnos
- [ ] Control de conflictos de agenda

### Módulo: Turnos y Reservas
- [ ] CRUD Turnos
- [ ] Reserva de cliente
- [ ] Control de cupo (10)
- [ ] Confirmación asistencia (30 min)
- [ ] Cancelación (1h)
- [ ] Límite semanal por plan

### Módulo: Pagos y Cuenta Corriente
- [x] Registrar pagos
- [ ] Deudas automáticas
- [ ] Recargo post día 10
- [ ] Estado moroso

### Módulo: Seguimiento Físico
- [x] CRUD Ejercicios
- [x] CRUD Rutinas
- [ ] Asignar rutina a cliente
- [ ] Registrar peso
- [ ] Registrar progreso

---

## 2) Modelo de Dominio

### Entidades Principales

**Usuario (Auth)**
- id, username, password, persona_id, rol_id, tipo_estado_id, created_at, updated_at
- Reglas: username único, password hasheada con bcrypt

**Persona**
- id, nombre, apellido, dni, cuil, direccion_id, tipo_persona_id
- Reglas: dni único

**Direccion**
- id, descripcion, municipio_id

**Empleado** (nueva entidad)
- id, persona_id, cargo, especialidad, estado, fecha_contratacion

**Turno**
- id, fecha, hora, instructor_id, actividad, tipo_pilates_id, tipo_estado_id, capacidad (default 10)
- Reglas: capacidad máx 10, fecha no en pasado

**Reserva**
- id, cliente_id, turno_id, estado, fecha_reserva, confirmacion_asistencia, cancelacion
- Estados: pendiente, confirmada, cancelada, asistio, no_asistio

**Progreso**
- id, cliente_id, fecha, peso, ejercicios_realizados, repeticiones

**Plan** (nueva entidad)
- id, nombre, tipo (mensual_2/mensual_3/casual), limite_semanal, precio

**Pago**
- id, cliente_id, fecha_pago, monto, concepto, tipo_pago

**Deuda**
- id, cliente_id, monto, fecha_vencimiento, intereses, estado

---

## 3) Historias de Usuario

---

### HU-01: Registro de Cliente con Afecciones Físicas

- **Como:** Administrador
- **Quiero:** Registrar un nuevo cliente con sus datos personales, credenciales y afecciones físicas
- **Para:** Gestionar el alta completa del cliente en el sistema

**Precondiciones:**
- Administrador autenticado
- Existencia de planes (mensual 2/3/casual)
- Existencia de municipios

**Flujo Principal:**
1. Administrador navega a "Nuevo Cliente"
2. Completa datos personales: nombre, apellido, DNI, CUIL, dirección
3. Completa credenciales: username, password
4. Selecciona plan: mensual 2, mensual 3 o casual
5. Registra afecciones físicas (texto libre)
6. Guarda cliente
7. Sistema crea Persona, Usuario, Direccion y asociaclón a Plan

**Flujos Alternativos / Errores:**
- E1: DNI duplicado -> Mostrar error "DNI ya existe"
- E2: Username duplicado -> Mostrar error "Usuario ya existe"
- E3: Campos obligatorios vacíos -> Validación inline

**Checklist de Tareas:**
- [ ] BE: Agregar campo `afecciones_fisicas` a tabla persona
- [ ] BE: Agregar campo `plan_id` a tabla user
- [ ] BE: Crear endpoint GET /plans para listar planes
- [ ] BE: Modificar POST /users/create para aceptar nuevos campos
- [ ] FE: Actualizar ClientForm con campos de afecciones y plan
- [ ] QA: Validar registro con todos los campos

**Criterios de Aceptación:**
- Gherkin:
  - Given usuario administrador logueado
  - When ingresa datos válidos de cliente incluyendo afecciones
  - Then sistema crea cliente exitosamente

**Unit Tests:**
- `create_client_with_afecciones`: valida guardado de texto libre
- `create_client_duplicate_dni_fails`: valida restricción de unicidad

---

### HU-02: Gestión de Empleados/Instructores (CRUD)

- **Como:** Administrador
- **Quiero:** Dar de alta, editar y eliminar empleados/instructores
- **Para:** Gestionar el equipo de trabajo del estudio

**Precondiciones:**
- Administrador autenticado

**Flujo Principal:**
1. Administrador navega a "Empleados"
2. Ve listado de empleados existentes
3. Presiona "Nuevo Empleado"
4. Completa: datos personales, cargo, especialidad, estado
5. Guarda empleado
6. Sistema crea Persona y Empleado

**Flujos Alternativos / Errores:**
- E1: Editar empleado -> Modifica datos manteniendo histórico
- E2: Eliminar -> Soft-delete (cambia estado a inactivo)

**Checklist de Tareas:**
- [ ] BE: Crear tabla `empleado`
- [ ] BE: Crear endpoint CRUD /api/employees
- [ ] FE: Crear página Employees.tsx
- [ ] FE: Crear formulario EmployeeForm.tsx
- [ ] QA: Validar CRUD completo

**Criterios de Aceptación:**
- Gherkin:
  - Given administrador logueado
  - When crea nuevo empleado con datos válidos
  - Then empleado aparece en listado

**Unit Tests:**
- `create_employee_success`: valida creación
- `soft_delete_employee`: valida cambio de estado

---

### HU-03: Crear Turnos con Control de Cupo

- **Como:** Administrador
- **Quiero:** Crear turnos specifying fecha, hora, instructor, actividad y tipo de pilates
- **Para:** Gestionar la disponibilidad de clases del estudio

**Precondiciones:**
- Administrador autenticado
- Existir instructores dados de alta

**Flujo Principal:**
1. Administrador navega a "Turnos"
2. Presiona "Nuevo Turno"
3. Selecciona fecha y hora
4. Selecciona instructor de la lista
5. Selecciona actividad (Pilates/Yoga)
6. Selecciona tipo pilates (suelo/máquinas) si aplica
7. Sistema muestra capacidad: 10 plazas (no editable)
8. Guarda turno

**Flujos Alternativos / Errores:**
- E1: Fecha en pasado -> Error "No se puede crear turno en el pasado"
- E2: Instructor con conflicto de horario -> Advertencia de conflicto

**Checklist de Tareas:**
- [ ] BE: Crear tabla `turno`
- [ ] BE: Validar fecha no sea pasado
- [ ] BE: Verificar conflicto de instructor
- [ ] BE: Endpoint CRUD /api/shifts
- [ ] FE: Crear página Shifts.tsx
- [ ] FE: Crear ShiftForm.tsx
- [ ] QA: Validar capacidad fija en 10

**Criterios de Aceptación:**
- Gherkin:
  - Given turno con fecha futura
  - When instructor disponible
  - Then turno creado con capacidad 10

**Unit Tests:**
- `create_shift_past_date_fails`: valida fecha
- `create_shift_conflict_instructor_warns`: valida advertencia

---

### HU-04: Reserva de Turno por Cliente

- **Como:** Cliente
- **Quiero:** Reservar un turno disponible
- **Para:** Asistir a la clase de pilates

**Precondiciones:**
- Cliente autenticado
- Cliente con plan activo
- Turno con cupo disponible

**Flujo Principal:**
1. Cliente navega a "Mis Turnos"
2. Ve listados de turnos disponibles
3. Selecciona turno deseado
4. Sistema valida: Cupo disponible, Plan permite reservar
5. Confirma reserva
6. Sistema decrementa cupo y crea reserva

**Flujos Alternativos / Errores:**
- E1: Cupo lleno -> Error "Turno completo"
- E2: Plan mensual 2 ya usó 2 turnos semana -> Error "Límite semanal alcanzado"
- E3: Cliente moroso -> Error "Tiene pagos pendientes"

**Checklist de Tareas:**
- [ ] BE: Crear tabla `reserva`
- [ ] BE: Validar cupo disponible (transacción)
- [ ] BE: Validar límite semanal por plan
- [ ] BE: Validar estado de cuenta (moroso)
- [ ] BE: Endpoint POST /api/reservations
- [ ] FE: Mostrar turnos disponibles con indicador de cupo
- [ ] FE: Botón reserva con validaciones
- [ ] QA: Probar reserva simultánea (concurrencia)

**Criterios de Aceptación:**
- Gherkin:
  - Given cliente con plan mensual 2 y 0 reservas esta semana
  - When reserva turno disponible
  - Then reserva creada exitosamente

**Unit Tests:**
- `reserve_shift_decrements_cupo`: valida decremento atómico
- `reserve_monthly_2_limit_weekly`: valida límite de 2
- `reserve_moroso_blocked`: valida bloqueo por deuda

---

### HU-05: Confirmación de Asistencia (30 min antes)

- **Como:** Cliente
- **Quiero:** Confirmar mi asistencia a un turno reservado
- **Para:** Garantizar mi lugar en la clase

**Precondiciones:**
- Cliente autenticado
- Tener reserva pendiente o confirmada

**Flujo Principal:**
1. Cliente ve sus reservas upcoming
2. Presiona "Confirmar Asistencia" en turno reservado
3. Sistema valida: faltan >= 30 minutos
4. Confirma asistencia
5. Reserva cambia a estado "confirmada"

**Flujos Alternativos / Errores:**
- E1: Menos de 30 min -> Error "Tiempo de confirmación vencido"
- E2: Ya confirmó -> Mostrar "Ya confirmado"

**Checklist de Tareas:**
- [ ] BE: Endpoint PUT /api/reservations/:id/confirm
- [ ] BE: Validar ventana de 30 minutos
- [ ] BE: Registrar timestamp confirmación
- [ ] FE: Botón confirmar en "Mis Turnos"
- [ ] FE: Contador regresivo para deadline
- [ ] QA: Validar后悔 validar con 29 min remaining

**Criterios de Aceptación:**
- Gherkin:
  - Given reserva con 45 min antes del turno
  - When confirma asistencia
  - Then asistencia confirmada exitosamente

**Unit Tests:**
- `confirm_within_30min_success`: valida ventana válida
- `confirm_less_30min_fails`: valida rechazo

---

### HU-06: Cancelación de Reserva (1 hora antes)

- **Como:** Cliente
- **Quiero:** Cancelar una reserva realizada
- **Para:** Liberar mi lugar para otro cliente

**Precondiciones:**
- Cliente autenticado
- Tener reserva activa

**Flujo Principal:**
1. Cliente ve sus reservas
2. Presiona "Cancelar" en turno reservado
3. Sistema valida: faltan >= 1 hora
4. Cancela reserva
5. Sistema incrementa cupo

**Flujos Alternativos / Errores:**
- E1: Menos de 1 hora -> Error "Cancelación tardía" y preguntar aplicar multa
- E2: Ya asistió -> No puede cancelar

**Checklist de Tareas:**
- [ ] BE: Endpoint PUT /api/reservations/:id/cancel
- [ ] BE: Validar ventana de 1 hora
- [ ] BE: Integrar con lógica de multa (pendiente)
- [ ] FE: Botón cancelar con confirmación
- [ ] FE: Mostrar mensaje de tardanza si aplica
- [ ] QA: Probar cancelación a 59 min

**Criterios de Aceptación:**
- Gherkin:
  - Given reserva con 2 horas antes
  - When cancela reserva
  - Then reserva cancelada y cupo liberado

**Unit Tests:**
- `cancel_within_1hour_success`: valida ventana válida
- `cancel_less_1hour_fails`: valida rechazo

---

### HU-07: Aplicar Recargo Automático Post Día 10

- **Como:** Sistema (job automático)
- **Quiero:** Aplicar interés automático a deudas vencidas
- **Para:** Gestionar morosidad automáticamente

**Precondiciones:**
- Existir deudas pendientes
- Estar en fecha >= día 10 del período

**Flujo Principal:**
1. Job Cron ejecuta diariamente a las 00:00
2. Consulta deudas pendientes con fecha_vencimiento < hoy
3. Aplica recargo según fórmula configurada
4. Registratraza del recargo aplicado
5. Actualiza estado a "con_recargo"

**Flujos Alternativos / Errores:**
- E1: Deuda ya tiene recargo -> No duplicar (idempotente)
- E2: Error en procesamiento -> Rollback y alerta

**Checklist de Tareas:**
- [ ] BE: Crear tabla `deuda` (si no existe)
- [ ] BE: Crear tabla `configuracion_recargo`
- [ ] BE: Implementar función aplicarRecargo()
- [ ] BE: Crear job Cron (node-cron)
- [ ] BE: Logging de operaciones
- [ ] QA: Simular fecha día 10 y validar cálculo

**Criterios de Aceptación:**
- Gherkin:
  - Given deuda vencida el día 5
  - When job corre el día 10
  - Then recargo aplicado una sola vez

**Unit Tests:**
- `recargo_no_duplicado`: valida idempotencia
- `recargo_formula_correcta`: valida cálculo

---

### HU-08: Registrar Peso del Cliente

- **Como:** Cliente
- **Quiero:** Registrar mi peso corporal con fecha
- **Para:** Hacer seguimiento de mi evolución física

**Precondiciones:**
- Cliente autenticado

**Flujo Principal:**
1. Cliente navega a "Mi Progreso"
2. Presiona "Registrar Peso"
3. Ingresa peso actual y fecha
4. Guarda registro
5. Sistema crea registro en tabla progreso

**Flujos Alternativos / Errores:**
- E1: Peso con fecha futura -> Error "Fecha no válida"

**Checklist de Tareas:**
- [ ] BE: Crear tabla `progreso` (o extender)
- [ ] BE: Endpoint POST /api/progress/weight
- [ ] FE: Formulario en página Progreso
- [ ] FE: Gráfico de evolución
- [ ] QA: Validar registro de peso

**Criterios de Aceptación:**
- Gherkin:
  - Given cliente autenticado
  - When registra peso 65kg
  - Then registro aparece en historial

**Unit Tests:**
- `register_weight_future_date_fails`: valida fecha

---

### HU-09: Registrar Ejercicios Realizados

- **Como:** Cliente
- **Quiero:** Registrar qué ejercicios realicé y las repeticiones
- **Para:** Registrar mi progreso en las rutinas

**Precondiciones:**
- Cliente autenticado
- Tener rutinas asignadas

**Flujo Principal:**
1. Cliente navega a "Mi Progreso"
2. Selecciona rutina realizada
3. Ingresa ejercicios completados con repeticiones
4. Guarda registro
5. Sistema registra en tabla progreso_detalle

**Checklist de Tareas:**
- [ ] BE: Extender tabla progreso
- [ ] BE: Endpoint POST /api/progress/exercises
- [ ] FE: Selector de ejercicios por rutina
- [ ] FE: Input de repeticiones
- [ ] QA: Validar registro

**Unit Tests:**
- `register_exercises_with_repeticiones`: valida guardado

---

### HU-10: Asignar Rutina a Cliente

- **Como:** Instructor/Administrador
- **Quiero:** Asignar una rutina a un cliente específico
- **Para:** Personalizar el entrenamiento del cliente

**Precondiciones:**
- Instructor/Admin autenticado
- Existir rutinas creadas

**Flujo Principal:**
1. Instructor navega a cliente específico
2. Presiona "Asignar Rutina"
3. Selecciona rutina del catálogo
4. Confirma asignación
5. Sistema vincula cliente con rutina

**Checklist de Tareas:**
- [ ] BE: Tabla `cliente_rutina` (si no existe)
- [ ] BE: Endpoint POST /api/clients/:id/routine
- [ ] FE: Modal de asignación en ClientDetail
- [ ] QA: Validar vinculación

**Criterios de Aceptación:**
- Gherkin:
  - Given cliente existente
  - When instructor asigna rutina
  - Then rutina visible en perfil del cliente

**Unit Tests:**
- `assign_routine_to_client`: valida vínculo

---

### HU-11: Recuperar Contraseña

- **Como:** Cliente
- **Quiero:** Recuperar mi contraseña de acceso
- **Para:** Volver a acceder al sistema

**Precondiciones:**
- Cliente registrado con email válido

**Flujo Principal:**
1. Cliente presiona "¿Olvidaste tu contraseña?"
2. Ingresa su email
3. Sistema valida email existe
4. Sistema genera token de recuperación
5. Sistema envía email con link (simulado en log)
6. Cliente accede al link
7. Ingresa nueva contraseña
8. Sistema actualiza password

**Flujos Alternativos / Errores:**
- E1: Email no existe -> Mostrar "Email no registrado" (evitar enumeración)
- E2: Token expirado -> Mostrar "Link vencido"

**Checklist de Tareas:**
- [ ] BE: Tabla `password_reset_token`
- [ ] BE: Endpoint POST /api/auth/forgot-password
- [ ] BE: Endpoint POST /api/auth/reset-password
- [ ] BE: Generación token con expiración
- [ ] FE: Página forgot-password
- [ ] FE: Página reset-password con token
- [ ] QA: Flujo completo de recuperación

**Unit Tests:**
- `forgot_password_sends_token`: valida generación
- `reset_password_with_valid_token`: valida cambio

---

## 4) Riesgos y Dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Reserva simultánea excede cupo | Alto | Transacción DB con lock |
| Recargo duplicado | Medio | Idempotencia en job |
| Conflicto instructor | Medio | Validación en creación turno |
| Fecha/hora timezone | Alto | Util centralizado |

---

## 5) No-Alcance

- Pasarela de pago real (MercadoPago/Stripe)
- Envío de emails reales
- App móvil
- Notificaciones push
- Marketplace / venta de productos

---

## 6) Pendientes de Negocio (ASUNCIONES)

1. **Fórmula recargo**: Se asume 5% mensual simple
2. **Precio planes**: Pendiente definir valores
3. **Monto multa cancelación**: Pendiente definir
4. **Precio casual**: Pendiente definir

---

*Historias generadas por Agente Analista*
*Fecha: 2026-02-28*

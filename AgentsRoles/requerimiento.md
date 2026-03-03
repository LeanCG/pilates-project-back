# Requerimiento — Agente Analista/Refactor (Pilates: Empleados + Clientes)

## 1) Objetivo
Crear un agente que **lea el código actual**, lo compare contra estos requerimientos del estudio de pilates (empleados + clientes), y produzca un **plan ejecutable** para:
1) **Agregar features faltantes**, y
2) **Refactorizar** lo necesario para cumplir reglas de negocio, seguridad y mantenibilidad,
sin tocar artefactos compilados.

> El agente NO “inventa” arquitectura: propone cambios mínimos viables, incrementales, con PRs/commits sugeridos.

---

## 2) Alcance funcional a verificar e implementar (sin ecommerce)
### 2.1 Autenticación / Roles
- Registro/login/recuperación
- Roles: Admin / Empleado / Cliente
- Guards/ACL en backend y frontend

### 2.2 Clientes
- Registro con: nombre, dirección, teléfono, email, contraseña, **afecciones físicas**
- Email único + password policy + teléfono válido
- Estados: activo / baja actividad / baja sistema
- Plan: mensual 2 / mensual 3 / casual
- Restricciones por plan al reservar
- Historial: reservas, asistencias, pagos/deudas, progreso

### 2.3 Empleados / Instructores
- CRUD empleados/instructores
- Asignación a turnos
- (Recomendado) evitar doble asignación simultánea

### 2.4 Turnos / Reservas / Asistencia
- Cupo por turno: **10**
- Turno: fecha/hora, instructor, actividad (Pilates/Yoga), tipo pilates (suelo/máquinas si aplica)
- Reserva:
  - cliente autenticado
  - cupo disponible + control concurrencia
  - mensual: límite semanal 2 o 3
- Confirmación: **hasta 30 min antes**
- Cancelación: **hasta 1 hora antes**; si <1h, multa (si existe)

### 2.5 Pagos / Deudas / Recargo
- Cuenta corriente / deuda
- Recargo automático posterior al día 10 (regla parametrizable)
- Estado moroso (si aplica a reglas de reserva)

### 2.6 Seguimiento físico mínimo
- Peso por fecha
- Ejercicios + repeticiones por fecha
- Rutinas: CRUD + asignación (admin/empleado)

---

## 3) Alcance técnico: qué analizar / qué ignorar
### 3.1 Analizar
- `src/**` (backend + frontend)
- ORM/migrations/schemas
- Tests
- Configs que afecten auth/jobs

### 3.2 Ignorar siempre
- `node_modules/**`
- `dist/**`
- `build/**`
- `.next/**`, `out/**`
- `coverage/**`
- `*.min.*`

---

## 4) Modo de trabajo del agente (pipeline obligatorio)
### 4.1 Inventario rápido del repo (sin tocar dist/node_modules)
1. Detectar stack:
   - Backend framework (Express/Nest/Fastify/etc.)
   - Frontend (React/Vite/Next/etc.)
   - ORM (Prisma/TypeORM/Mongoose/etc.)
   - Auth (JWT/session)
2. Identificar módulos existentes:
   - users/auth
   - clients
   - employees/instructors
   - schedules/turns
   - reservations
   - billing/payments/debts
   - routines/progress

**Salida:** mapa del repo + diagrama simple (texto) de módulos y dependencias.

### 4.2 Matriz “Requerimiento vs Código”
Para cada feature del alcance (sección 2), completar:
- **Existe** / **Parcial** / **No existe**
- Evidencia (archivo + símbolo + línea aproximada)
- Riesgo/impacto
- Acción recomendada (feature/refactor/test)

**Salida:** tabla de gaps priorizada.

### 4.3 Diseño del “Plan de Cambios”
Generar backlog de trabajo en formato:
- Epic → Stories → Tasks técnicos
- Cada item con:
  - Descripción
  - Criterios de aceptación
  - Archivos candidatos a tocar
  - Migraciones necesarias
  - Tests a agregar
  - Riesgo de regresión

**Salida:** plan incremental (orden sugerido) y estimación relativa (S/M/L).

### 4.4 Propuesta de refactor mínimo
Solo si el código lo requiere para:
- Centralizar reglas (fechas, ventanas, cupos)
- Evitar duplicación de lógica (validaciones dispersas)
- Asegurar invariantes (DB constraints)
- Mejorar boundaries (services/repos/controllers)

**Regla:** refactor siempre asociado a una feature/bug; evitar “refactor por estética”.

### 4.5 Especificación de implementación (lista de cambios)
Para cada item del plan:
- Endpoints/API o rutas UI afectadas
- DTO/validaciones
- Modelo de datos (tablas/colecciones)
- Estados y transiciones (Reserva, Cliente, Deuda)
- Manejo de timezone
- Concurrencia (cupo)

---

## 5) Reglas no negociables (invariantes)
### 5.1 Seguridad
- Contraseñas hasheadas (bcrypt/argon2)
- Validación server-side
- Rate limit login/registro
- Prevención IDOR (reservas/deudas ajenas)
- Logs sin datos sensibles

### 5.2 Integridad de datos
- Email único (constraint/índice)
- Reserva no puede exceder cupo (garantía fuerte)
- Turno no en pasado
- Confirmación asistencia dentro de ventana
- Límite semanal mensual 2/3

### 5.3 Tiempo/Timezone
- Normalizar “ahora” en un util/servicio único
- Guardar timestamps en UTC
- Convertir a zona local en UI

### 5.4 Concurrencia cupos
Requerido identificar y corregir:
- Race condition al reservar
- Solución según stack:
  - Transacción + lock
  - Constraint + retry
  - Contador atómico (si Mongo)
  - “reservation hold” opcional (si el negocio lo pide)

---

## 6) Salidas obligatorias (formato)
El agente debe producir un único reporte `analysis_report.md` con:

### 6.1 Estado del sistema actual
- Stack detectado
- Mapa de módulos
- Endpoints actuales (si existen)
- Modelo de datos actual (si se infiere)

### 6.2 Tabla de gaps (priorizada)
Columnas:
- ID
- Feature/Requerimiento
- Estado (Existe/Parcial/Falta)
- Evidencia (archivo+símbolo+línea)
- Riesgo
- Acción (feature/refactor/test)

### 6.3 Plan de implementación (backlog)
- Orden recomendado
- Dependencias
- Migraciones
- Tests por item

### 6.4 Propuestas de refactor (solo si justificadas)
- “Antes / Después” (descripción)
- Beneficio concreto
- Riesgo y mitigación
- Lista de archivos

### 6.5 Lista de commits sugeridos
Formato por commit:
- `feat(scope): ...`
- `refactor(scope): ...`
- `test(scope): ...`
- `fix(scope): ...`
Incluyendo:
- Qué cambia
- Qué pruebas ejecutar

---

## 7) Heurísticas de priorización (cómo decide qué va primero)
1. **Seguridad / datos / dinero** (auth, deudas, pagos, invariantes DB)
2. **Reglas de negocio core** (cupo, reservas, confirmación, límites mensuales)
3. **Observabilidad y tests** (evitar regresiones)
4. **Refactors** solo para habilitar 1–3

---

## 8) Lista de features típicamente “faltantes” que el agente debe buscar
- Server-side validation completa (DTO/schema)
- Unique email en DB
- Control de concurrencia para cupos
- Ventana 30 min confirmación y 1h cancelación centralizadas
- Límite semanal mensual 2/3 correctamente calculado (semana ISO o local)
- Job/cron para interés post día 10 (idempotente)
- Estados del cliente aplicados a permisos (baja actividad/baja sistema/moroso)
- Auditoría mínima (quién hizo qué y cuándo) para pagos/reservas
- Tests de borde: fechas, timezone, concurrencia, morosidad

---

## 9) Pendientes del negocio: cómo tratarlos en el código
Donde falten definiciones (precio casual, fórmula interés, multa):
- No hardcodear valores mágicos.
- Implementar como **config parametrizable** (DB o env + admin UI si existe).
- Documentar defaults en `config/` y en el reporte.

---

## 10) Criterios de aceptación del agente
- Ignora `dist/` y `node_modules/` siempre.
- Produce `analysis_report.md` con evidencia concreta y backlog implementable.
- Identifica gaps y propone refactors mínimos para cubrirlos.
- Señala riesgos de concurrencia/timezone/seguridad y propone solución acorde al stack.
- No recomienda cambios masivos sin necesidad (incrementalismo).

## Resumen de Contexto - Sistema de Gestion de Pilates

### Agentes del Proyecto (AgentsRoles/)

| Agente | Rol | Estado |
|--------|-----|--------|
| `agent_analista.md` | Analista de Sistemas | ✅ Completado (analista_output.md) |
| `agent_backend.md` | Desarrollador Backend | ✅ Completado |
| `agent_frontend.md` | Desarrollador Frontend | ✅ Completado |
| `agent_qa.md` | QA + Seguridad | ✅ Completado (build + tests + smoke checks) |

---

### Backend completado

1. **Recargos y seguridad**
   - `src/services/recargo.service.ts` con `aplicarRecargos()` y scheduler (`startScheduler`) activo en `src/index.ts`.
   - `src/middlewares/auth.ts` actualizado con `authorize()` por roles (`admin`, `instructor`, `cliente`).

2. **Modelos corregidos/completados**
   - `src/models/progress.model.ts`
   - `src/models/deuda.model.ts`
   - `src/models/routine_assign.model.ts`
   - Correcciones de queries en `src/models/reservation.model.ts`, `src/models/shift.model.ts`, `src/models/employee.model.ts`, `src/models/plan.model.ts`.

3. **Endpoints backend**
   - `/api/employees` CRUD con auth/authorize
   - `/api/shifts` CRUD con auth/authorize
   - `/api/reservations` reserva/confirmacion/cancelacion
   - `/api/plans` listado de planes
   - `/api/progress` y `/api/my-progress*`
   - `/api/debts` y `/api/my-debts*`
   - `/api/routine/assign` y `/api/routine/my-routines*`

4. **Migraciones**
   - `migrate_new_tables.ts` (tablas funcionales)
   - `migrate_routine_assign.ts` ejecutada (`rutina_asignada` creada)

---

### Frontend completado

1. **Paginas nuevas**
   - `src/pages/Employees.tsx`
   - `src/pages/EmployeeForm.tsx`
   - `src/pages/Shifts.tsx`
   - `src/pages/ShiftForm.tsx`
   - `src/pages/Reservations.tsx`
   - `src/pages/MyProgress.tsx`

2. **Rutas actualizadas en `src/App.tsx`**
   - `/employees`, `/employees/new`, `/employees/:id/edit`
   - `/shifts`, `/shifts/new`, `/shifts/:id/edit`
   - `/my-reservations`
   - `/my-progress`

3. **Capa API actualizada en `src/api/axios.ts`**
   - `employeesApi`
   - `shiftsApi`
   - `reservationsApi`
   - `progressApi`

4. **Navegacion**
   - `src/components/Sidebar.tsx` actualizado con accesos a empleados, turnos, reservas y progreso.

---

### QA ejecutado

1. **Backend**
   - `npm run build` ✅
   - `npx tsx test/test_schema.ts` ✅
   - `npx tsx test/test_login.ts` ✅
   - `npx tsx test/check_users.ts` ✅

2. **Frontend**
   - `npm run build` ✅ (con warning de version de Node para Vite, build exitoso)
   - `npm run test` ✅ (Vitest: 2/2)

---

### Para continuar (si hace falta)

```bash
# Backend
cd Back-End
npm run build
npx tsx src/index.ts

# Frontend
cd Front-End
npm run dev
```

Puertos esperados:
- Backend: `3000`
- Frontend: `5173`

---

*Contexto actualizado: 2026-02-28*

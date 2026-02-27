# Requerimiento: Sistema de Gestión de Pilates

## 0) Resumen ejecutivo
- Problema: Código fuertemente acoplado en controladores backend, dificultad de mantenimiento, UI acoplada con EJS.
- Objetivo: Refactorizar a TypeScript + React manteniendo las reglas de negocio, aplicando Clean Architecture.
- Usuarios objetivo: Administradores, instructores y clientes del estudio de Pilates.
- Resultado esperado (qué cambia / qué mejora): Mayor escalabilidad, código fuertemente tipado (TS), separación de Frontend/Backend, código limpio y mantenible.

## 1) Alcance
### 1.1 Incluye (in scope)
- Migración de Backend (Express JS a Express TS).
- Creación de Frontend moderno y dinámico en React.
- Abstracción de base de datos a un patrón de Repositorio.
- Autenticación segura mediante JWT.

### 1.2 No incluye (out of scope)
- Cambiar el motor de base de datos (se mantiene MySQL).
- Migración de datos (la estructura de base de datos sigue igual).

## 2) Actores y roles
- Rol: Administrador
  - Permisos generales: ABM de usuarios, rutinas, ejercicios, control de caja y dashboard.
- Rol: Instructor/Usuario
  - Restricciones: Acceso limitado a dashboards o configuraciones maestras.

## 3) Flujos principales (end-to-end)
### Flujo A: Registro y Facturación de Usuario
1) Se toman datos personales (Persona + Dirección).
2) Se calculan descuentos y se genera Cabecera/Detalle de Factura en Caja.
3) Se asigna el Turno de Pilates al usuario creado.

### Flujo B: Gestión de Rutinas
1) Se configuran ejercicios.
2) Se asocian ejercicios a una rutina específica para los clientes.

## 4) Reglas de negocio
- RB-01: Usuarios únicos por DNI y Username.
- RB-02: Cálculos de descuentos automáticos al crear una suscripción o turno.
- RB-03: Separación lógica de entes (Persona vs Usuario).

## 5) Datos y entidades (nivel funcional)
- Entidad: Persona & User
  - Relaciones: Un registro de Persona puede tener un Auth User asociado.
- Entidad: Turnos y Rutinas
  - Relaciones: Manejan asignaciones horarias para las disciplinas impartidas.
- Entidad: Facturación
  - Relaciones: Cabeceras y detalles que apuntan a la Persona física (comprador).

## 6) Requerimientos no funcionales
- Seguridad: Hasheo bcrypt, protección endpoints JWT.
- UX / accesibilidad: Diseño vanguardista y rápido usando React y Single Page Application (SPA).
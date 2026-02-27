# Entregables: Analista de Sistemas

A continuación se presentan las especificaciones funcionales solicitadas, estructuradas a partir de `requerimiento.md` y `stack.md`.

## 1) Mapa funcional
- Módulo: Gestión de Usuarios y Autenticación
  - Feature: Registro de personas y cuentas de usuario
  - Feature: Autenticación (Login) y autorización basada en Roles (Administrador, Instructor)
  - Feature: Consulta y actualización de datos de perfil
- Módulo: Facturación y Caja
  - Feature: Listado de facturas y control de caja
  - Feature: Generación de facturas con cálculo automático de descuentos
- Módulo: Gestión de Turnos y Suscripciones (Pilates)
  - Feature: Asignación de turnos a usuarios
  - Feature: Listado y ABM de clases/turnos disponibles
- Módulo: Gestión de Rutinas Deportivas
  - Feature: Configuración (ABM) de ejercicios
  - Feature: Creación y asignación de rutinas a usuarios

## 2) Modelo del dominio
### Entidades
- **Persona**
  - Atributos: `id (PK)`, `nombre (String, Obligatorio)`, `apellido (String, Obligatorio)`, `dni (String, Obligatorio, Único)`, `cuil (String)`, `direccion_id (FK)`
  - Reglas: Debe tener datos básicos de contacto e identificación reales. Una Persona puede ser Usuario.
- **Usuario (Auth)**
  - Atributos: `id (PK)`, `username (String, Único)`, `password_hash (String)`, `rol_id (FK)`, `persona_id (FK)`, `estado_id (FK)`
  - Reglas: Maneja el acceso al sistema (autenticación JWT). Un usuario siempre pertenece a una persona.
- **Direccion**
  - Atributos: `id (PK)`, `calle (String)`, `municipio_id (FK)`
- **Factura (Cabecera y Detalle)**
  - Atributos Cabecera: `id (PK)`, `comprador_id (FK a Persona)`, `numero_factura (String)`, `sub_total (Decimal)`, `descuento (Decimal)`, `fecha (Date)`
  - Atributos Detalle: `id (PK)`, `cantidad (Int)`, `precio (Decimal)`, `cabecera_id (FK)`
  - Reglas: El total se calcula aplicando el porcentaje de descuento sobre el precio base multiplicado por la cantidad.
- **Turno (Pilates)**
  - Atributos: `id (PK)`, `fecha (Date)`, `hora (Time)`, `user_id (FK)`, `tipo_pilates_id (FK)`
  - Reglas: Asocia un usuario a una clase o turno específico en el tiempo.
- **Ejercicio**
  - Atributos: `id (PK)`, `nombre (String)`, `descripcion (Text)`
- **Rutina**
  - Atributos: `id (PK)`, `nombre (String)`, `user_id (FK)`
  - Reglas: Agrupa múltiples ejercicios personalizados para un alumno.

### Relaciones
- **Persona** 1..1 **Usuario** (Registro extendido con credenciales)
- **Persona** 1..N **Factura** (Una persona puede realizar múltiples compras/pagos)
- **Factura** 1..N **DetalleFactura** (Composición de factura)
- **Usuario** 1..N **Turno** (Un alumno asiste a muchas clases)
- **Usuario** 1..N **Rutina** (Un instructor asigna rutinas a usuarios)
- **Rutina** N..M **Ejercicio** (Relación intermedia `Rutina_Ejercicio`)

### Reglas globales
- RG-01: Los descuentos en facturación deben ser calculados en el backend, no confiados al frontend.
- RG-02: La unicidad del sistema se valida a través del `DNI` (Persona) y del `Username` (Usuario).

## 3) Historias de usuario

### HU-01: Registro Completo de Cliente (Facturación y Turno)
**Quién:** Administrador
**Para qué:** Registrar a un cliente, facturar su suscripción y asignarle su primer turno.
**Por qué:** Para ingresar clientes físicos al estudio, cobrarles y reservales un horario en el sistema.

**Precondiciones**
- El administrador debe estar autenticado en el sistema.

**Flujo principal**
1. El Administrador navega a la sección de "Alta de Cliente".
2. Ingresa los datos personales (Nombres, DNI, Dirección).
3. Ingresa las credenciales del usuario (Username, Password, Rol).
4. El sistema calcula el total a pagar en base al precio y porcentaje de descuento ingresado.
5. El Administrador asigna fecha y horario para el primer turno de Pilates.
6. El Administrador guarda los cambios.
7. El sistema crea la Dirección, la Persona, el Usuario, el Turno y la Factura con su detalle simultáneamente.

**Flujos alternativos / errores**
- E1: El DNI o Username ya existen -> El sistema muestra alerta `Usuario existente` o `Nombre en uso`.
- E2: Falla la creación de algún registro secundario (ej. Factura) -> El sistema revierte la creación para evitar inconsistencias de la Persona (requiere Transacción DB).

**Checklist de tareas**
- Backend: Implementar controlador `/api/users (POST)` agrupando inserts dentro de una transacción MySQL (Models).
- Frontend: Migrar vista `register.ejs` a componente React. Conectar formulario con validaciones cruzadas.
- QA: Validar integridad de creación a través de UI y verificar rechazo por unicidad.

**Criterios de aceptación**
- Gherkin:
  - Given que soy un Administrador logueado
  - When registro a un nuevo cliente llenando todos los campos válidos
  - Then el sistema guarda todos los datos referenciados y emite confirmación de éxito.
- El cálculo del descuento (precio * (1 - descuento/100)) se realiza correctamente en la capa Backend.

**Unit tests esperados**
- `validate_discount_calculation`: valida que la función matemática del descuento aplique los montos exactos de la factura.
- `createUser_conflict_dni`: valida que enviar un DNI duplicado retorne HTTP 409 Conflict.

---

### HU-02: Creación de Rutinas Deportivas
**Quién:** Instructor
**Para qué:** Combinar ejercicios existentes y generar una rutina para sus clases o alumnos particulares.
**Por qué:** Para estandarizar los entrenamientos.

**Precondiciones**
- El perfil debe tener permisos para editar ejercicios (Instructor/Admin).
- Deben existir ejercicios en el sistema.

**Flujo principal**
1. Acceder al tablero de Rutinas y presionar "Nueva Rutina".
2. Nombrar la rutina e indicar a qué alumno/usuario se asignará.
3. Buscar y seleccionar ejercicios de la lista agregándolos a la rutina.
4. Confirmar creación.

**Flujos alternativos / errores**
- E1: La lista de ejercicios está vacía -> El sistema muestra empty state invitando a crear ejercicios primero.

**Checklist de tareas**
- Backend: Endpoint POST para tabla `rutina` y la tabla pivote de relación con `ejercicios`.
- Frontend: Formulario reactivo con selector/buscador de ejercicios dinámico.
- QA: Validar límite numérico de ejercicios agregados (si aplica).

**Criterios de aceptación**
- La rutina se persiste guardando correctamente en BDD qué ejercicios ordenados la componen.
- El frontend bloquea el botón "Guardar" hasta elegir al menos 1 ejercicio y nombre.

**Unit tests esperados**
- `save_routine_without_exercises_fails`: valida la regla que impide rutinas vacías en la API.

---

### HU-03: Visualización del Dashboard (Control de Caja Mínimo)
**Quién:** Administrador
**Para qué:** Revisar su métricas clave, como el número de alumnos inscritos o facturas emitidas de este mes.
**Por qué:** Para entender rápidamente el estado financiero y operativo del negocio de Pilates.

**Precondiciones**
- Requiere autenticación y tener Rol de "Administrador".

**Flujo principal**
1. Entrar al sistema / Iniciar Sesión exitosamente.
2. El sistema redirige automáticamente a la pantalla de Inicio (Home/Dashboard).
3. Se observan tarjetas (cards) resumiendo total de clientela e ingresos acumulados.

**Checklist de tareas**
- Backend: Controlador `/api/dashboard` consultando las métricas agrupadas en las tablas (COUNT usuarios, SUM cabecera_factura).
- Frontend: Migrar lógica del `home.ejs` para consumir endpoint y mostrar métricas.
- QA: Confirmar que los sumatorios en dashboard coinciden con la suma manual de comprobantes en el listado.

**Criterios de aceptación**
- Los datos numéricos mostrados deben excluir los registros soft-deleted (por ejemplo, aquellos con rol "borrado" o "baja").

**Unit tests esperados**
- `dashboard_metrics_ignore_deleted_users`: valida que el conteo en SQL solo contemple estados activos.

## 4) Riesgos y dependencias
- Riesgo: La inserción gigante de la `HU-01` en múltiples tablas podría dejar data huérfana si hay error a medio camino | Impacto: Alto | Mitigación: El backend debe envolver todo en sentencias `START TRANSACTION` / `COMMIT` / `ROLLBACK`.
- Dependencia: MySQL.

## 5) No-alcance
- No se incluirá una pasarela de pago real (MercadoPago/Stripe). La "facturación" y "caja" son controles internos (solo registro de pago efectivo/manual).
- No se enviarán emails a clientes en esta etapa de refactor.

## ASUNCIONES
- Se asume que el sistema de logueo (sesiones / JWT) será resuelto por el Backend usando Tokens.

## PREGUNTAS ABIERTAS
1. ¿Es necesario algún tipo de "roles jerárquicos" donde el Admin pueda ver todo pero un Instructor solo a sus alumnos? (Asumido en HU: el administrador ve todo y a todos).

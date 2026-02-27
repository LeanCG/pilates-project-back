# Entregables: Ingeniero Backend

A continuación se presentan el diseño backend implementable siguiendo MVC y el uso de Express + TypeScript, a partir del `requerimiento.md`, `stack.md` y `analista_output.md`.

## 1) Arquitectura backend
### Capas
- **Rutas (Routes):** Definición declarativa de endpoints con inyección de middlewares de validación (Zod/express-validator) y Auth (JWT).
- **Controladores (Controllers):** Orquestación de requests, delegación a Modelos para acceso a DB y construcción de respuestas HTTP (status codes).
- **Modelos (Models):** Encapsulación de sentencias MySQL nativas (usando `mysql2/promise`). Ejecución de lógica de datos (transacciones, inserts complejos).
- **Presentación (Views):** React compilado y servido estáticamente por Express.

### Módulos Principales
- `AuthModule`: Generación y validación de sesiones JWT (login/logout).
- `UserModule`: Alta, baja y consulta de usuarios y personas.
- `RoutineModule`: Administración de rutinas deportivas y catálogo de ejercicios.
- `DashboardModule`: Consultas analíticas sumarizadas.

### Patrones
- **Data Access Object (DAO) vía Models:** Aplicado en el módulo de persistencia para desacoplar el SQL bruto de los controladores.
- **Transacciones de BDD:** Aplicado en la creación del Usuario para asegurar atomicidad (Persona + Auth + Factura + Turno simultáneos).

## 2) Diseño de datos
### Entidades persistentes
*(El esquema se basa fuertemente en el código legacy pero ordenado y reforzado)*
- `persona`
  - Campos: `id INT AI PK`, `nombre VARCHAR(100) NOT NULL`, `apellido VARCHAR(100) NOT NULL`, `dni VARCHAR(20) UNIQUE NOT NULL`, `cuil VARCHAR(25)`, `direccion_id INT FK`
  - Constraints: Unique Constraint en `dni`.
- `user`
  - Campos: `id INT AI PK`, `username VARCHAR(50) UNIQUE NOT NULL`, `password VARCHAR(255) NOT NULL`, `persona_id INT FK`, `rol_id INT FK`
  - Índices: Índice B-Tree en `username` para agilizar login.
- `direccion`
  - Campos: `id INT AI PK`, `calle VARCHAR(255) NOT NULL`, `municipio_id INT FK`
- `cabecera_factura`
  - Campos: `id INT AI PK`, `comprador_id INT FK`, `numero_factura VARCHAR(50) UNIQUE`, `sub_total DECIMAL(10,2)`, `descuento DECIMAL(5,2)`, `fecha_factura DATE`
- `detalle_factura`
  - Campos: `id INT AI PK`, `cabecera_factura_id INT FK`, `cantidad INT NOT NULL`, `precio DECIMAL(10,2)`
- `rutina`
  - Campos: `id INT AI PK`, `nombre VARCHAR(100) NOT NULL`, `user_id INT FK`
- `ejercicio`
  - Campos: `id INT AI PK`, `nombre VARCHAR(100) NOT NULL`
- `rutina_ejercicio` (Tabla pivote)
  - Campos: `rutina_id INT FK`, `ejercicio_id INT FK`, `orden INT`

### Migraciones
1. `001_initial_schema.sql`: Creación de tablas legado.
2. `002_add_unique_constraints.sql`: Añade explícitamente UNIQUE a tabla user y persona.
3. `003_add_session_table.sql` (Opcional si persistimos JWT tokens revocados, pero omitido por JWT stateless).

## 3) Contratos API

### POST `/api/auth/login`
- Auth: Pública
- Request Body DTO: `{ username: string(min 3), password: string(min 6) }`
- Response 200: `{ token: "jwt_string", user: { id: 1, role: "admin" } }`
- Errores: `401 Unauthorized` (credenciales inválidas)

### POST `/api/users` (Alta Integrada)
- Auth: Token, Rol Administrador
- Request Body DTO: 
  ```json
  {
    "nombre": "string", "apellido": "string", "dni": "string",
    "direccion": "string", "municipio_id": "number",
    "username": "string", "password": "string(min:6)", "rol_id": "number",
    "fecha_turno": "YYYY-MM-DD", "hora": "HH:MM", "tipo_pilates_id": "number",
    "precio": "number", "descuento": "number"
  }
  ```
- Response 201: `{ message: "Usuario y turno generados exitosamente", userId: 5 }`
- Errores: `409 Conflict` (DNI o Username de Auth ya en uso). `500 Server Error` (Fallo en transacción SQL).

### POST `/api/routine` (Creación de Rutina)
- Auth: Token, Rol Admin/Instructor
- Request Body DTO: `{ user_id_assignee: number, nombre_rutina: string, ejercicios: [ { ejercicio_id: number, orden: number } ] }`
- Response 201: `{ message: "Rutina generada" }`
- Errores: `400 Bad Request` (ejercicios array vacío).

### GET `/api/dashboard/metrics`
- Auth: Token, Rol Administrador
- Response 200: `{ total_usuarios_activos: number, ingresos_mes_actual: number, turnos_pendientes: number }`

## 4) Reglas y validaciones
- Regla: **Cálculo de Descuentos en Servidor**
  - Capa: Model (DAO de Facturas) / Controller.
  - Validación: Frontend solo envía `precio_base` y `%_descuento`. Backend valida que `%_descuento <= 100` y mayor a `0`.
  - Error: 400 Bad Request si los márgenes de descuento son irreales.
- Regla: **Unicidad de Perfil**
  - Capa: Controller / BDD (Unique constraint)
  - Validación: Verificación `SELECT count` previa a abrir transacción y captura de error de clave duplicada MySQL MySQL (código 1062).

## 5) Plan de testing
### Unit tests (Capa de lógica simple)
- `test_calcularDescuento`: valida que enviar `{precio: 1000, descuento: 10}` retorna un neto de 900.
- `test_jwtSign`: verificar payload JWT y expiración.

### Integration tests (API Mocks)
- `test_POST_users_transaction_rollback`: Fuerza error en el paso número 4 (Ej. fallando el query de turnos) simulando un error y verificando que el usuario/persona original no queden huérfanos en BD.
- `test_POST_auth_invalid`: Valida error 401 enviando contraseña errada para username válido.

## 6) Seguridad
- **AuthN:** Tokens JWT `(jsonwebtoken)` firmados con secreto en `.env`, pasados por Header `Authorization: Bearer <token>`.
- **AuthZ:** Middleware `checkRole(['admin'])` antes de llamar al Controller en rutas como `/api/dashboard` o `/api/users`.
- **Rate limiting:** `express-rate-limit` global (Max 100 Req por minuto), y estricto en `/api/auth/login` (Max 5 intentos).
- **Sanitización:** `express-validator` para hacer un `trim()`, `escape()` en datos de ingreso (como `nombre`, `apellido`, `direccion_id`).
- **OWASP relevantes:**
  - A01 Broken Access Control: Mitigación con middleware `verifyJWT` obligatorio por defecto.
  - A03 Injection: Consultas MySQL usando el sintagma parametrizado `mysql2`: `SELECT * FROM user WHERE id = ?`. Prohibida interpolación de variables pura (`${id}`).
  - A07 Auth Failures: Uso riguroso de `bcryptjs` para contraseñas.

## 7) ASUNCIONES
- Express servirá los estáticos (el build de Vite) montando `app.use(express.static('client/dist'))` al final del middleware stack en entorno de producción.
- `bcryptjs` asume salt rounds de 10 como en el sistema legado.

## PREGUNTAS ABIERTAS
1. ¿Existen restricciones de longitud/alfanuméricas específicas a imponer sobre las contraseñas de instructores a diferencia de clientes? (Asumo un mínimo de 6 caracteres genérico por ahora debe tener al menos una mayuscula, una minuscula y un numero y un caracter especial
).

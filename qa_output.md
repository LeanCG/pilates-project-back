# Entregables: Ingeniero QA + Seguridad

A continuación presento el plan de validación integral (funcional, regresión, API y seguridad), enfocado en los criterios generados previamente y el `stack.md` acordado.

## 1) Estrategia de testing
- Alcance in-scope: Funcionalidades Core E2E de Administradores e Instructores (Backend Express + App React servida conjuntamente).
- Fuera de alcance: Facturación real a tarjetas de crédito. Pasarelas de pago. Emails de confirmación externos.
- Niveles:
  - Smoke: Levantar el servidor y asegurar que el render de Vite sirve React sobre el puerto principal de Express (status `200`). API `/login` responde sanamente.
  - Funcional: Validación de todos los casos y flujos del Frontend.
  - Integraciòn/API: Todos los endpoints con Testing transaccional BDD.
  - E2E: Cypress script simulando UI.
  - Seguridad: Testing de Inyección en los inputs y vulnerabilidades de token JWT.
- Ambientes y datos de prueba: Base de datos separada `pilates_db_test` que se limpia (TRUNCATE) cada inicio de suite test unitaria en el CI.

## 2) Casos de prueba por historia
| ID | Historia | Precondición | Pasos | Datos | Resultado esperado |
|---|---|---|---|---|---|
| TC-001 | HU-01 | Usuario logueado (Admin) | 1. Ir a /clientes/new <br> 2. Llenar form <br> 3. Enviar | `{ dni: "123", username: "u_1", password: "123", descuento: 10, precio: 1000 }` | API: 201 Created. Vista informa éxito y total de 900 persistido. |
| TC-002 | HU-01 | Usuario logueado | 1. Ir a /clientes/new <br> 2. Repetir dni del paso 1 | `{ dni: "123" }` | API: 409 Conflict. BD Persona no se altera. Mensaje de error a UI. |
| TC-003 | HU-02 | Admin | Ir a /routines/new, dejar ejercicios vacío, [Guardar] | `{ }` | Botón Guardar inhabilitado por UI. Si viaja API (bypass), API devuelve 400. |
| TC-004 | HU-03 | Instructor Logueado sin permisos | Ir URL directa a `/dashboard` | Token rol `instructor` | React (via AuthGuard) redirige a 403 u ocultación. API niega metrics (403). |

## 3) Checklist de seguridad
- Auth: 
  - Intentos masivos con pass incorrecta (Max Limits).
  - El password real no es devuelto jamás desde un Response (`SELECT password` ausente en respuestas API).
- Sesiones/tokens:
  - Verificar temporalidad (Token expira en tiempo prudencial 8h).
  - Falla validación si firma JWT de request no matchea `.env` secret.
- Control de acceso (horizontal/vertical):
  - Usuario X no puede acceder a las rutinas de Persona Y vía params spoofing `/api/users/Y`.
- Inyección (SQL/command):
  - DNI o Nombres con payload `' OR 1=1 --` para forzar bypass en query. Escapado de comillas garantizado.
- XSS/CSRF:
  - Prevenir renderizado de etiquetas `<script>` en el grid del Frontend pasadas en `descripcion` nombre de rutina. React Native sanitiza, pero validar inserción cruzada.

## 4) Pruebas de API (Colección Insomnia/Postman)
### Estructura
- Folder: **Auth**
  - Request: `POST Login` | `/api/auth/login` | Pre-req: - | Body: `admin`/`admin123`.
  - Assertions: Status = `200`. Body contiene variable JWT que se guarda referencialmente para carpeta protegida.
- Folder: **Users/Clients**
  - Request: `POST Creador Integral` | `/api/users` 
  - Assertions: Status = `201`. Tiempo respuesta < 800ms. Base de datos no falla en transacciones relacionadas.
  - Request: `POST Conflicto DNI` | `/api/users` 
  - Assertions: Status = `409` usando los datos pre-creados anteriormente.

## 5) Plan de regresión
- Suite crítica (P0): Flujo de Alta de Usuarios/Facturas. Flujos de Autenticación.
- Suite alta (P1): Asignación / Guardado de Rutinas.
- Suite media (P2): Visualización correcta de Dashboard analítico.
- Disparadores: Antes del Build en master, al levantar rama hacia producción.
- Criterio de selección: Casos con interacciones multi-tabla son críticos (riesgo de data corrupta).

## 6) Criterios de salida (Go/No-Go)
- Go si:
  - 100% casos de prueba (TC-001 y Login) pasan (P0).
  - Al menos el 85% de la suite secundaria completa OK sin memory leaks.
  - Sin defectos críticos (app crash, credenciales base expuestas) abiertos.
- No-Go si:
  - El DNI repetido rompe el servidor SQL arrojando error no atrapado (app crash).
  - El Login tira tokens corruptos.

## 7) ASUNCIONES
- Se validará en entorno Windows (SO base).
- El Cypress testing abarcará un scope de Happy Path para agilizar el proceso hasta pulir bugs maduros.

## PREGUNTAS ABIERTAS
1. ¿El borrado lógico (`tipo_estado_id = 2`) en la Base de Datos debe ser reversible por la interfaz en el futuro? De eso dependen mis pruebas E2E (asumo que es borrado lógico opaco al usuario, pero QA podría requerir validar qué sucede en DB exacta).

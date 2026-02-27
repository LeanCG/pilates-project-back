# Entregables: Ingeniero Frontend

A continuación presento la arquitectura de experiencia de usuario y estructuración del proyecto React (SPA), derivada de `requerimiento.md`, `stack.md` y `analista_output.md`.

## 1) IA de Navegación
La aplicación se estructurará usando `react-router-dom v6` protegida mediante un wrapper de autocomprobación de JWT.

- `/login`: Pantalla de inicio de sesión | Acceso: **Público**
- `/` o `/dashboard`: Dashboard principal (Control de Caja) | Acceso: **Admin**
- `/clients`: Listado de usuarios/clientes | Acceso: **Admin**
- `/clients/new`: Alta de cliente (Factura + Turno simultáneos) | Acceso: **Admin**
- `/clients/:id`: Edición y detalle del cliente | Acceso: **Admin/Usuario propio**
- `/routines`: Panel general de rutinas | Acceso: **Admin/Instructor**
- `/routines/new`: Configuración de una rutina a partir de ejercicios | Acceso: **Admin/Instructor**
- `/exercises`: ABM de ejercicios base | Acceso: **Admin/Instructor**

## 2) Wireflow textual

### Flujo: Alta Integrada de Cliente (`HU-01`)
1. Pantalla `/clients`: El usuario presiona `[+ Nuevo Cliente]`.
2. Pantalla `/clients/new`: Muestra formulario dividido en 3 pasos/secciones (Datos Personales, Credenciales, Suscripción/Factura). El usuario llena los campos. El subtotal se actualiza reactivamente por cada modificación del input `descuento%`.
3. Pantalla `/clients/new`: El usuario presiona `[Guardar]`.
4. El sistema interacciona con API. Re-render con overlay *Loading*.
5. Pantalla `/clients`: Redirección en caso de Success (201) mostrando un Toast/Notificación `Cliente registrado y turno asignado`.

Alternativos:
- E1: Conflicto 409 (DNI/Username) -> Muestra mensaje de error al final del formulario remarcando en rojo el input culpable: `Este DNI ya está registrado`.
- E2: Validación de formularios interceptada antes de llamar a la API -> El botón de guardado no se desencadena y se marcan errores `Zod` (ej. Contraseña debe tener 6 caracteres).

## 3) Componentes Core
### `AuthGuard`
- Responsabilidad: Wrapper (HOC) protector de rutas que verifica si hay token en `localStorage/Context`. Si no hay, redirige a `/login`.

### `GlassCard`
- Responsabilidad: Contenedor estético (glassmorphism: blur, borde traslúcido, sombra suave) universal para paneles y formularios.
- Props: `children: ReactNode`, `className?: string`, `elevation?: number`

### `ClientForm`
- Responsabilidad: Orquestar el estado complejo del registro y previsualizar subtotal de factura reactivamente.
- Props: `initialData?: Partial<ClientData>`, `onSubmit: (data: ClientData) => Promise<void>`
- Estado local: Formularios manejados transparentemente por `react-hook-form` asociado al resolver de `zod`. Estado derivado: `totalCalculado`.

### `RoutineBuilder`
- Responsabilidad: Interfaz de drag-and-drop o selección de lista múltiple para armar la tabla `rutina_ejercicio`.
- Props: `availableExercises: Exercise[]`
- Estado local: `selectedExercises: {exercise: Exercise, order: number}[]`

## 4) Integración API
Se empleará `Axios`. Las respuestas seguirán un patrón común con un interceptor global que cierre la sesión si el código devuelto es `401`.

### Servicios
- `AuthService.login(credentials)` -> `POST /api/auth/login`
- `ClientService.create(clientData)` -> `POST /api/users`
- `DashboardService.getMetrics()` -> `GET /api/dashboard/metrics`

### Manejo de estados global
- **Loading:** Skeleton screens para listados (clientes, dashboard). Overlays con spinners sutiles sobre botones de acción asíncronos (ej. Submit form).
- **Error:** Componentizado con una librería de alertas modernas (ej. Sonner/React-Hot-Toast estilo flat UI oscuro) para avisos efímeros, y mensajes `<span className="error-text">` incrustados bajo cada input conflictivo.
- **Empty state:** Tarjetas placeholder en tablas indicando sin resultados: `"Aún no hay rutinas registradas."` + botón call to action primario.
- **Caching:** Para listados que cambian poco (como `availableExercises`), cachear respuesta en Contexto Global o evitar peticiones redundantes tras el primer cargue de la SPA, invalidando cache si se añade un ejercicio nuevo.

## 5) Validaciones y Accesibilidad
### Zod Schemas
- Campo: `username` | Regla: `min(3), string()` | Mensaje: `"El usuario debe tener al menos 3 caracteres."`
- Campo: `password` | Regla: `min(6)` | Mensaje: `"La contraseña debe tener mínimo 6 caracteres."`
- Campo: `descuento` | Regla: `min(0), max(100)` | Mensaje: `"El porcentaje no puede cruzar el 100%."`

### Accesibilidad básica
- Todos los inputs contarán con `label` conectada vía `id` <-> `htmlFor`.
- Enfoque claro visual (outline nativo personalizado) en el componente genérico de campos de texto.
- Uso de `aria-invalid` atado a los errores del `react-hook-form`.
- El contraste de texto obedecerá AA guidelines para asegurar lecturabilidad sobre los contenedores Glassmorphism oscuros.

## 6) Plan de testing
### Unit tests UI (Vitest + Testing Library)
- `ClientForm_Calculates_Subtotal`: Valida la previsualización del porcentaje de descuento sobre el total ingresado en el campo base mediante `fireEvent.change`.
- `AuthGuard_Redirects_Unauthenticated`: Valida que intentar renderizar un componente privado sin JWT lance componente `<Navigate to="/login" />`.

### E2E críticos (Cypress / Playwright)
- `Complete_Client_Registration`: Escenario real llenando el form de cliente + intercept HTTP a `/api/users` garantizando que el usuario vuelve a `/clients` viendo la notificación correcta.

## 7) ASUNCIONES
- El estado general (sesión activa de UX, token JWT) puede ser manejado sin librerías externas pesadas (Redux), implementando tan solo `React Context` por el tamaño no enterprise del aplicativo.
- La paleta de colores implementada en CSS Vanilla respetará colores contrastantes con base escura y matices púrpuras ("estética moderna") en alusión al stack demandado.

## PREGUNTAS ABIERTAS
1. ¿El listado `clients` necesita paginación real por servidor (limit / offset) o la tabla cargará todos los registros al renderizar? (De mi lado asumiré paginación nativa solo frontend si los registros son manejables, y luego server-side pagination).

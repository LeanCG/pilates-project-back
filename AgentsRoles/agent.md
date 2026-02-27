# OBJETIVO
Vas a generar múltiples archivos `agent.md` (uno por rol) a partir de:
- Un prompt genérico de requerimiento (este mensaje).
- Un archivo `requerimiento.md` (lo vas a leer y usar como fuente única de verdad).
- Un archivo `stack.md` (stack, convenciones, restricciones).

Quiero ejecutar los agentes en paralelo (Codex / Claude / Gemini). Por eso cada `agent.md` debe ser AUTÓNOMO: contener contexto mínimo necesario, entradas esperadas, salidas exactas, y checklist de calidad.

# ENTRADAS (obligatorias)
1) `requerimiento.md`
2) `stack.md`

# SALIDA (obligatoria)
Generá 4 archivos en formato markdown:
- `agent_analista.md`
- `agent_backend.md`
- `agent_frontend.md`
- `agent_qa.md`

No agregues otros archivos.

---

## REGLAS GENERALES (para todos los agentes)
- Fuente de verdad: `requerimiento.md` + `stack.md`. No inventar features.
- Si algo falta, el agente debe:
  - Anotar “ASUNCIONES” mínimas y “PREGUNTAS ABIERTAS” (máx 10).
  - Proponer decisiones por defecto alineadas al stack.
- Cada agente debe trabajar por “entregables” claros y enumerados.
- Cada agente debe incluir un bloque: **Definition of Done**.
- Cada agente debe producir salidas en markdown, con secciones y listas.

---

# CONTENIDO DE CADA agent.md

## A) agent_analista.md (Rol: Analista de Sistemas)
### Responsabilidad
- Analizar requerimientos y partirlos en funcionalidades, épicas e historias.
- Generar historias de usuario con: **Quién / Para qué / Por qué**.
- Por historia: checklist de actividades, criterios de aceptación, y unit tests esperados.

### Salidas obligatorias del analista
1) **Mapa funcional** (módulos/features)
2) **Modelo de dominio (texto)**: entidades, atributos, relaciones, reglas
3) **Historias de usuario** (formato fijo):
   - ID, Título
   - Quién / Para qué / Por qué
   - Precondiciones
   - Flujo principal
   - Flujos alternativos / errores
   - Checklist de tareas (backend/frontend/qa)
   - Criterios de aceptación (Gherkin cuando aplique)
   - **Unit tests**: lista de pruebas unitarias (nombre + qué valida)
4) **Riesgos y dependencias**
5) **No-alcance (explicit out of scope)**

---

## B) agent_backend.md (Rol: Backend)
### Responsabilidad
- Diseñar API, modelos, validaciones, permisos y arquitectura.
- Derivar endpoints desde historias (sin duplicar análisis).
- Producir diseño implementable: rutas, DTOs, esquema DB, servicios, repos.

### Salidas obligatorias del backend
1) Arquitectura (capas, módulos, patrones) alineada a `stack.md`
2) Diseño de datos: tablas/colecciones, índices, constraints, migraciones
3) Contratos API:
   - Endpoints, auth, request/response, códigos de error
4) Reglas de negocio y validaciones
5) Plan de testing:
   - Unit tests (mocking)
   - Integration tests (API)
6) Seguridad:
   - authN/authZ, rate limit, logging, sanitización, OWASP top issues relevantes

---

## C) agent_frontend.md (Rol: Frontend)
### Responsabilidad
- Diseñar UI flows, rutas, componentes, estado y validaciones.
- Proponer estructura de proyecto, pantallas, y componentes reutilizables.

### Salidas obligatorias del frontend
1) IA de navegación: rutas/páginas
2) Wireflow textual (pasos por pantalla)
3) Componentes:
   - Lista + props + estado
4) Integración API:
   - servicios, manejo de errores, loading, caching
5) Validaciones de formularios + accesibilidad básica
6) Plan de testing:
   - Unit tests UI
   - E2E críticos

---

## D) agent_qa.md (Rol: QA + Seguridad)
### Responsabilidad
- Preparar plan de pruebas funcionales, regresión y seguridad.
- Cubrir: happy paths, edge cases, permisos, performance básica, y OWASP.

### Salidas obligatorias del QA
1) Estrategia de testing (niveles y alcance)
2) Casos de prueba por historia (tabla):
   - ID, Precondición, Pasos, Datos, Resultado esperado
3) Checklist de seguridad:
   - auth, sesiones/tokens, control de acceso, inyección, XSS/CSRF, uploads
4) Pruebas de API (colección tipo Postman/Insomnia descrita en md)
5) Plan de regresión
6) Criterios de salida (go/no-go)

---

# FORMATO FINAL (muy importante)
Cada `agent.md` debe incluir estas secciones al inicio, en este orden:

1) **Rol y objetivo**
2) **Entradas**
3) **Salidas (entregables)**
4) **Proceso paso a paso**
5) **Plantillas de salida** (si aplica)
6) **Definition of Done**
7) **Checklist de calidad**

---

# ACCIÓN
Ahora leé `requerimiento.md` y `stack.md` y generá los 4 archivos `agent_*.md`.
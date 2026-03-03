# Stack y convenciones

## App target
- Tipo: Web app (Pilates Management System)
- Entornos: dev / prod
- Repos: Monolito (Frontend en React compilado y servido de forma estática por el Backend en Express)

## Backend
- Lenguaje / framework: TypeScript + Node.js (Express)
- Arquitectura: MVC (Models manejando DB, Controllers manejando lógica/respuestas, Views siendo React)
- DB: MySQL (consultas nativas via `mysql2/promise` abstractas en Models)
- Auth: JWT y manejo de sesiones seguras
- Estándares: ESLint, Prettier, TypeScript Strict Mode
- Testing: Jest (para capa de servicios y utilidades)

## Frontend
- Framework: React (con Vite) + TypeScript
- Router: React Router v6
- State management: Context API / Zustand (según complejidad)
- UI kit: Componentes custom con Vanilla CSS (estética moderna, glassmorphism)
- Forms/validation: React Hook Form + Zod
- Testing: Vitest para unit tests de UI

## DevOps
- Docker: Si
- Observabilidad: Winston/Morgan para logs de Node.js

## Seguridad
- Hash passwords: bcryptjs
- Rate limiting: express-rate-limit 
- CORS/CSRF: Configuración CORS estricta en Express

## Convenciones de entrega
- Formato de docs: Markdown
- Nomenclatura de ramas: feature/nombre, bugfix/nombre
- Commit style: Conventional Commits
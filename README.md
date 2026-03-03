# Pilates Project Backend & Frontend

## Overview
This repository contains a **full‑stack Pilates studio management system** built with:
- **Backend**: Node.js, Express, TypeScript, MySQL (MVC pattern).
- **Frontend**: Vite + React + TypeScript, styled with a glassmorphism theme and Lucide icons.
- **Testing**: Vitest, React Testing Library, Cypress (E2E).
- **Deployment**: Vite production build, can be served by any static host (e.g., Vercel, Netlify) or via the Express server in production.

## Folder Structure
```
pilates-project-back/
├─ client/                     # React frontend (Vite)
│  ├─ public/                # Static assets (videos, images)
│  │   └─ videos/pilates_welcome.mp4
│  ├─ src/
│  │  ├─ components/         # Reusable UI components (GlassCard, Sidebar, etc.)
│  │  ├─ pages/              # React pages (Dashboard, Clients, Routines, …)
│  │  ├─ hooks/              # Custom hooks (useApi)
│  │  ├─ api/                # Axios instance & interceptors
│  │  └─ App.tsx             # Router & layout
│  ├─ vite.config.ts          # Vite config with proxy to backend
│  └─ package.json           # Frontend dependencies & scripts
├─ src/                       # Express backend (MVC)
│  ├─ controllers/           # Route handlers
│  ├─ models/                # Database models
│  ├─ routes/                # API routes
│  ├─ views/                 # Legacy EJS templates (now converted to React)
│  └─ index.ts               # Server entry point
├─ test_*.ts                 # DB schema & login test scripts
├─ fix_hash.ts               # Script to fix password column length
├─ .gitignore                # Ignored files
├─ package.json              # Backend dependencies & scripts
└─ README.md                 # **This file**
```

## Tech Stack
- **Node.js** (v20) & **Express** – API server, MVC architecture.
- **MySQL** – relational data store.
- **TypeScript** – static typing for both backend and frontend.
- **React 18** + **Vite** – fast dev server, HMR.
- **Lucide‑React** – modern SVG icons.
- **Vitest** + **React Testing Library** – unit tests.
- **Cypress** – end‑to‑end tests.
- **bcryptjs** – password hashing.
- **JWT** – authentication.
- **Axios** – HTTP client with interceptor.
- **Glassmorphism CSS** – premium UI styling.

## Development Setup
1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd pilates-project-back
   ```
2. **Install dependencies**
   ```bash
   # Backend
   npm install   # installs backend deps (express, mysql2, etc.)
   # Frontend
   cd client && npm install
   ```
3. **Create a `.env` file** (copy from `.env.example` if present) with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_DATABASE=pilates_db
   JWT_SECRET=your_jwt_secret
   ```
4. **Run the database** – ensure a MySQL instance is running and the schema is imported (see `db/schema.sql`).
5. **Start the development servers** (two terminals):
   ```bash
   # Backend (watch mode)
   npm run dev   # from project root
   # Frontend (Vite)
   cd client && npm run dev
   ```
   The Vite dev server proxies `/api/*` to `http://localhost:3000`.
6. Open <http://localhost:5173> in a browser.

## Docker Development Setup
If you prefer using Docker, you can start the entire stack (Database, Backend, Frontend) with a single command:

1. **Ensure Docker and Docker Compose are installed.**
2. **Start the containers** from the root directory:
   ```bash
   docker-compose up --build
   ```
   - **Database (db)**: MySQL 8.0 running on port 3306.
   - **Backend (backend)**: Node.js API running on port 3000 (hot-reload enabled).
   - **Frontend (frontend)**: Vite dev server running on port 5173 (hot-reload enabled).
3. Open <http://localhost:5173> in your browser.

> [!TIP]
> Use `docker-compose down` to stop and remove the containers. Database data is persisted in a Docker volume named `mysql_data`.

## API Documentation (Swagger)
The API is documented using **Swagger/OpenAPI 3.0**. Once the backend is running, access the interactive documentation at:

> **<http://localhost:3000/api-docs>**

From there you can explore all endpoints, see request/response schemas, and test the API directly from the browser.

## Testing
- **Unit tests** (Vitest):
  ```bash
  cd client && npx vitest run
  ```
- **E2E tests** (Cypress):
  ```bash
  npx cypress open   # opens the Cypress UI
  # or headless
  npx cypress run
  ```
- **Database scripts** (`test_login.ts`, `test_schema.ts`) can be executed with:
  ```bash
  npx ts-node test_login.ts
  npx ts-node test_schema.ts
  ```

## Production Build & Deployment

### Standard Build
1. **Build the frontend**
   ```bash
   cd client && npm run build
   ```
2. **Build the backend**
   ```bash
   npm run build
   ```
3. **Run the application**
   ```bash
   npm run start
   ```

### Production Docker Build
For a lightweight and isolated production environment, use the multi-stage Dockerfile:

1. **Build the production image**:
   ```bash
   docker build -f Dockerfile.prod -t pilates-studio:prod .
   ```
2. **Run the production container**:
   ```bash
   docker run -d -p 3000:3000 --name pilates_prod --env-file .env pilates-studio:prod
   ```
   *Ensure your `.env` has the correct production database credentials.*

> [!NOTE]
> The multi-stage build automatically runs tests (if configured in build hooks) and compiles both frontend and backend, keeping the final image size minimal.

## Scripts Overview
| Script | Description |
|--------|-------------|
| `npm run dev` | Starts backend with nodemon (watch mode). |
| `npm run start` | Starts backend in production (`node dist/index.js`). |
| `client/npm run dev` | Vite dev server with hot reload. |
| `client/npm run build` | Production build of React app. |
| `client/npm test` | Runs Vitest unit tests. |
| `npx cypress open` | Opens Cypress UI for E2E tests. |
| `npx ts-node test_login.ts` | Checks admin login hashing. |
| `npx ts-node test_schema.ts` | Inspects DB schema. |
| `npx ts-node fix_hash.ts` | Fixes password column length and re‑hashes admin password. |

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Follow the existing code style (TypeScript strict mode, Prettier). Use the **Vercel React best‑practice** skill for any UI changes.
4. Write tests for new functionality.
5. Submit a pull request.

---
*Generated on 2026‑02‑27 by Antigravity – a powerful AI coding assistant.*
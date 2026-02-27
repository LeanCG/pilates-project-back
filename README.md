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
1. **Build the frontend**
   ```bash
   cd client && npm run build
   ```
   This creates a `dist/` folder with static assets.
2. **Serve the built assets**
   - **Option A – via Express** (recommended for a single‑server deployment):
     ```typescript
     // In client/src/index.ts (already present)
     app.use(express.static(path.join(__dirname, '../client/dist')));
     app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
     ```
     Then run the backend in production mode:
     ```bash
     npm run start   # from project root
     ```
   - **Option B – static host** (Vercel, Netlify, Cloudflare Pages):
     Deploy the `client/dist` folder as a static site and configure the backend URL as an environment variable (`VITE_API_URL`).
3. **Environment variables** for production should be set on the host (DB credentials, JWT secret, etc.).

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
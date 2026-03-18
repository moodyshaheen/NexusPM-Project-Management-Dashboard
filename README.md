# NexusPM — Project Management Dashboard

NexusPM is a full-stack project management application built for teams and individuals who need a clean, fast way to organize projects and track tasks. It features a Kanban-style task board, full project CRUD, and JWT-based authentication — all in a single deployable app.

---

## Who is it for?

- **Small teams** managing multiple projects simultaneously
- **Freelancers** tracking client work and deliverables
- **Developers** who want a self-hosted, no-subscription PM tool
- **Anyone** who finds tools like Jira overkill for their workflow

---

## What it does

- **Projects** — Create, view, edit, and delete projects with status, priority, team, and due date
- **Task Board** — Kanban board per project with drag-and-drop across To Do / In Progress / Done columns
- **Tasks** — Add, edit, and delete tasks with title, description, priority, assignee, due date, and labels
- **Authentication** — Register and login with email/password; sessions managed via HTTP-only JWT cookies
- **Route Protection** — All project pages require authentication; unauthenticated users are redirected to login
- **Persistent Storage** — All data stored in a local SQLite database, seeded with sample data on first run

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 5](https://astro.build) (SSR mode) |
| UI | [React 18](https://react.dev) + [Tailwind CSS 3](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| Routing | [React Router v7](https://reactrouter.com) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Drag & Drop | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) |
| Database | [SQLite](https://sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Auth | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) + [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) |
| Server | [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) (standalone adapter) |
| Icons | [Lucide React](https://lucide.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:4321`.

On first run, the database is automatically created at `data/nexuspm.db` and seeded with sample projects and tasks.

### Build for Production

```bash
npm run build
node dist/server/entry.mjs
```

---

## Deploying to Vercel

NexusPM uses SQLite which writes to the local filesystem. Vercel's serverless functions have a **read-only filesystem** (except `/tmp`), so a standard SQLite deployment won't persist data between requests.

### Option A — Use Vercel with an external database (recommended)

Replace `better-sqlite3` with a hosted database:

- **[Turso](https://turso.tech)** — SQLite-compatible, edge-ready (easiest migration)
- **[Neon](https://neon.tech)** — Serverless Postgres
- **[PlanetScale](https://planetscale.com)** — Serverless MySQL

### Option B — Deploy to a VPS (simplest for SQLite)

Platforms that support persistent filesystems work out of the box:

- **[Railway](https://railway.app)** — `npm run build` then deploy, add a volume
- **[Render](https://render.com)** — Web service with persistent disk
- **[Fly.io](https://fly.io)** — Docker-based, attach a volume for `data/`

### Option C — Vercel + `/tmp` (non-persistent, demo only)

Change `DB_PATH` in `src/lib/db.ts` to `/tmp/nexuspm.db`. Data resets on every cold start — only suitable for demos.

```ts
const DB_PATH = '/tmp/nexuspm.db';
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | `nexuspm-dev-secret-change-in-production` | Secret key for signing JWT tokens |

Set this in a `.env` file or your hosting platform's environment settings:

```env
JWT_SECRET=your-strong-random-secret-here
```

---

## Project Structure

```
src/
├── components/
│   ├── pages/          # Page-level React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Router.tsx      # Client-side routing
│   └── TaskBoard.tsx   # Kanban board
├── pages/
│   └── api/            # Astro API routes (REST endpoints)
│       ├── auth/       # login, register, logout, me
│       ├── projects/   # CRUD for projects
│       └── tasks/      # CRUD for tasks
├── lib/
│   ├── db.ts           # SQLite connection & schema
│   └── auth.ts         # JWT helpers
├── entities/           # TypeScript interfaces
└── data/
    └── db.json         # Seed data
integrations/
├── cms/                # BaseCrudService (API client)
└── members/            # Auth context & provider
```

---

## License

MIT

import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// On Vercel (read-only FS), use /tmp. Locally use data/ in project root.
const DB_PATH = process.env.VERCEL
    ? '/tmp/nexuspm.db'
    : join(__dirname, '../../data/nexuspm.db');

// Ensure the data directory exists (local only)
if (!process.env.VERCEL) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (_db) return _db;

    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');

    initSchema(_db);
    seedIfEmpty(_db);

    return _db;
}

function initSchema(db: Database.Database) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      status TEXT DEFAULT 'Planning',
      team TEXT,
      start_date TEXT,
      due_date TEXT,
      priority TEXT DEFAULT 'Medium',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      title TEXT,
      description TEXT,
      status TEXT DEFAULT 'To Do',
      priority TEXT DEFAULT 'Medium',
      due_date TEXT,
      assigned_to TEXT,
      labels TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }).c;
    if (count > 0) return;

    try {
        const seedPath = join(__dirname, '../data/db.json');
        const seed = JSON.parse(readFileSync(seedPath, 'utf-8'));

        const insertProject = db.prepare(`
      INSERT INTO projects (id, name, description, status, team, start_date, due_date, priority, created_at, updated_at)
      VALUES (@id, @name, @description, @status, @team, @start_date, @due_date, @priority, @created_at, @updated_at)
    `);

        const insertTask = db.prepare(`
      INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assigned_to, labels, created_at, updated_at)
      VALUES (@id, @project_id, @title, @description, @status, @priority, @due_date, @assigned_to, @labels, @created_at, @updated_at)
    `);

        const seedAll = db.transaction(() => {
            for (const p of seed.projects) {
                insertProject.run({
                    id: p._id,
                    name: p.name ?? null,
                    description: p.description ?? null,
                    status: p.status ?? 'Planning',
                    team: p.team ?? null,
                    start_date: p.startDate ?? null,
                    due_date: p.dueDate ?? null,
                    priority: p.priority ?? 'Medium',
                    created_at: p._createdDate ?? new Date().toISOString(),
                    updated_at: p._updatedDate ?? new Date().toISOString(),
                });
            }
            for (const t of seed.tasks) {
                insertTask.run({
                    id: t._id,
                    project_id: t.projectId,
                    title: t.title ?? null,
                    description: t.description ?? null,
                    status: t.status ?? 'To Do',
                    priority: t.priority ?? 'Medium',
                    due_date: t.dueDate ?? null,
                    assigned_to: t.assignedTo ?? null,
                    labels: t.labels ?? null,
                    created_at: t._createdDate ?? new Date().toISOString(),
                    updated_at: t._updatedDate ?? new Date().toISOString(),
                });
            }
        });

        seedAll();
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

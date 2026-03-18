import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getDbUrl(): string {
    // Vercel: use /tmp (ephemeral but works)
    if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
    if (process.env.VERCEL) return 'file:/tmp/nexuspm.db';
    const dbPath = join(__dirname, '../../data/nexuspm.db');
    mkdirSync(dirname(dbPath), { recursive: true });
    return `file:${dbPath}`;
}

const client = createClient({
    url: getDbUrl(),
    authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function getDb() {
    if (!initialized) {
        await initSchema();
        await seedIfEmpty();
        initialized = true;
    }
    return client;
}

async function initSchema() {
    await client.executeMultiple(`
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
      updated_at TEXT DEFAULT (datetime('now'))
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

async function seedIfEmpty() {
    const result = await client.execute('SELECT COUNT(*) as c FROM projects');
    const count = result.rows[0].c as number;
    if (count > 0) return;

    try {
        const seedPath = join(__dirname, '../data/db.json');
        const seed = JSON.parse(readFileSync(seedPath, 'utf-8'));

        for (const p of seed.projects) {
            await client.execute({
                sql: `INSERT INTO projects (id, name, description, status, team, start_date, due_date, priority, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    p._id, p.name ?? null, p.description ?? null,
                    p.status ?? 'Planning', p.team ?? null,
                    p.startDate ?? null, p.dueDate ?? null,
                    p.priority ?? 'Medium',
                    p._createdDate ?? new Date().toISOString(),
                    p._updatedDate ?? new Date().toISOString(),
                ],
            });
        }

        for (const t of seed.tasks) {
            await client.execute({
                sql: `INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assigned_to, labels, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    t._id, t.projectId, t.title ?? null, t.description ?? null,
                    t.status ?? 'To Do', t.priority ?? 'Medium',
                    t.dueDate ?? null, t.assignedTo ?? null, t.labels ?? null,
                    t._createdDate ?? new Date().toISOString(),
                    t._updatedDate ?? new Date().toISOString(),
                ],
            });
        }
    } catch (e) {
        console.error('Seed failed:', e);
    }
}

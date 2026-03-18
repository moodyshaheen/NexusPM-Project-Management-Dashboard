import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export const GET: APIRoute = async () => {
    const db = await getDb();
    const result = await db.execute(
        'SELECT id, name, description, status, team, start_date, due_date, priority, created_at, updated_at FROM projects ORDER BY created_at DESC'
    );
    return Response.json(result.rows.map(mapProject));
};

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const db = await getDb();
    const id = randomUUID();
    const now = new Date().toISOString();

    await db.execute({
        sql: `INSERT INTO projects (id, name, description, status, team, start_date, due_date, priority, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
            id, body.name ?? null, body.description ?? null,
            body.status ?? 'Planning', body.team ?? null,
            body.startDate ?? null, body.dueDate ?? null,
            body.priority ?? 'Medium', now, now,
        ],
    });

    const row = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] });
    return Response.json(mapProject(row.rows[0]), { status: 201 });
};

export function mapProject(row: any) {
    return {
        _id: row.id,
        name: row.name,
        description: row.description,
        status: row.status,
        team: row.team,
        startDate: row.start_date,
        dueDate: row.due_date,
        priority: row.priority,
        _createdDate: row.created_at,
        _updatedDate: row.updated_at,
    };
}

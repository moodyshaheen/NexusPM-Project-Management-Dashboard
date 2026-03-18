import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export const GET: APIRoute = ({ url }) => {
    const db = getDb();
    const projectId = url.searchParams.get('projectId');

    const rows = projectId
        ? db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at ASC').all(projectId)
        : db.prepare('SELECT * FROM tasks ORDER BY created_at ASC').all();

    return Response.json(rows.map(mapTask));
};

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    if (!body.projectId) return Response.json({ error: 'projectId is required' }, { status: 400 });

    const db = getDb();
    const id = body._id ?? randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
    INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assigned_to, labels, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id, body.projectId, body.title ?? null, body.description ?? null,
        body.status ?? 'To Do', body.priority ?? 'Medium',
        body.dueDate ?? null, body.assignedTo ?? null, body.labels ?? null,
        now, now
    );

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return Response.json(mapTask(task), { status: 201 });
};

export function mapTask(row: any) {
    return {
        _id: row.id,
        projectId: row.project_id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        dueDate: row.due_date,
        assignedTo: row.assigned_to,
        labels: row.labels,
        _createdDate: row.created_at,
        _updatedDate: row.updated_at,
    };
}

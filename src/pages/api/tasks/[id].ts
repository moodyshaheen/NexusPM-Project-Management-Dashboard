import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { mapTask } from './index';

export const GET: APIRoute = ({ params }) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(params.id);
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(mapTask(row));
};

export const PUT: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const db = getDb();
    const now = new Date().toISOString();

    // Build dynamic SET clause — only update fields that were actually sent
    const fields: string[] = [];
    const values: unknown[] = [];

    if (body.title !== undefined) { fields.push('title = ?'); values.push(body.title); }
    if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
    if (body.status !== undefined) { fields.push('status = ?'); values.push(body.status); }
    if (body.priority !== undefined) { fields.push('priority = ?'); values.push(body.priority); }
    if (body.dueDate !== undefined) { fields.push('due_date = ?'); values.push(body.dueDate); }
    if (body.assignedTo !== undefined) { fields.push('assigned_to = ?'); values.push(body.assignedTo); }
    if (body.labels !== undefined) { fields.push('labels = ?'); values.push(body.labels); }

    if (fields.length === 0) return Response.json({ error: 'No fields to update' }, { status: 400 });

    fields.push('updated_at = ?');
    values.push(now);
    values.push(params.id);

    const result = db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    if (result.changes === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(params.id);
    return Response.json(mapTask(row));
};

export const DELETE: APIRoute = ({ params }) => {
    const db = getDb();
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(params.id);
    if (result.changes === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ success: true });
};

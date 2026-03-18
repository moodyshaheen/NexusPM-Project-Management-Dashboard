import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { mapTask } from './index';

export const GET: APIRoute = async ({ params }) => {
    const db = await getDb();
    const result = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [params.id!] });
    if (!result.rows[0]) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(mapTask(result.rows[0]));
};

export const PUT: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const db = await getDb();
    const now = new Date().toISOString();

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
    values.push(params.id!);

    const result = await db.execute({ sql: `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, args: values as any[] });
    if (result.rowsAffected === 0) return Response.json({ error: 'Not found' }, { status: 404 });

    const row = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [params.id!] });
    return Response.json(mapTask(row.rows[0]));
};

export const DELETE: APIRoute = async ({ params }) => {
    const db = await getDb();
    const result = await db.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [params.id!] });
    if (result.rowsAffected === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ success: true });
};

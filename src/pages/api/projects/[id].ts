import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { mapProject } from './index';

export const GET: APIRoute = ({ params }) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(params.id);
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(mapProject(row));
};

export const PUT: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const db = getDb();
    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: unknown[] = [];

    if (body.name !== undefined) { fields.push('name = ?'); values.push(body.name); }
    if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
    if (body.status !== undefined) { fields.push('status = ?'); values.push(body.status); }
    if (body.team !== undefined) { fields.push('team = ?'); values.push(body.team); }
    if (body.startDate !== undefined) { fields.push('start_date = ?'); values.push(body.startDate); }
    if (body.dueDate !== undefined) { fields.push('due_date = ?'); values.push(body.dueDate); }
    if (body.priority !== undefined) { fields.push('priority = ?'); values.push(body.priority); }

    if (fields.length === 0) return Response.json({ error: 'No fields to update' }, { status: 400 });

    fields.push('updated_at = ?');
    values.push(now);
    values.push(params.id);

    const result = db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    if (result.changes === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(params.id);
    return Response.json(mapProject(row));
};

export const DELETE: APIRoute = ({ params }) => {
    const db = getDb();
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(params.id);
    if (result.changes === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ success: true });
};

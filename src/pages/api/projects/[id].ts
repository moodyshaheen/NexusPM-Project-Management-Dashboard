import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';
import { mapProject } from './index';

export const GET: APIRoute = async ({ params }) => {
    const db = await getDb();
    const result = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [params.id!] });
    if (!result.rows[0]) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(mapProject(result.rows[0]));
};

export const PUT: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const db = await getDb();
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
    values.push(params.id!);

    const result = await db.execute({ sql: `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, args: values as any[] });
    if (result.rowsAffected === 0) return Response.json({ error: 'Not found' }, { status: 404 });

    const row = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [params.id!] });
    return Response.json(mapProject(row.rows[0]));
};

export const DELETE: APIRoute = async ({ params }) => {
    const db = await getDb();
    const result = await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [params.id!] });
    if (result.rowsAffected === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ success: true });
};

import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDb } from '@/lib/db';
import { signToken, makeAuthCookie } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
    const { email, password, name } = await request.json();
    if (!email || !password) return Response.json({ error: 'Email and password are required' }, { status: 400 });

    const db = await getDb();
    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
    if (existing.rows[0]) return Response.json({ error: 'Email already registered' }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    await db.execute({ sql: 'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)', args: [id, email, hash, name ?? null] });

    const token = signToken({ id, email, name: name ?? email });
    return Response.json(
        { id, email, name: name ?? email },
        { status: 201, headers: { 'Set-Cookie': makeAuthCookie(token) } }
    );
};

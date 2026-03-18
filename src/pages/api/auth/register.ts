import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDb } from '@/lib/db';
import { signToken, makeAuthCookie } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
    const { email, password, name } = await request.json();

    if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
        return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    db.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)').run(id, email, hash, name ?? null);

    const token = signToken({ id, email, name: name ?? email });
    return Response.json(
        { id, email, name: name ?? email },
        { status: 201, headers: { 'Set-Cookie': makeAuthCookie(token) } }
    );
};

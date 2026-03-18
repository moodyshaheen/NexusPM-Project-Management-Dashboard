import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken, makeAuthCookie } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
    const { email, password } = await request.json();

    if (!email || !password) {
        return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name ?? user.email });
    return Response.json(
        { id: user.id, email: user.email, name: user.name },
        { headers: { 'Set-Cookie': makeAuthCookie(token) } }
    );
};

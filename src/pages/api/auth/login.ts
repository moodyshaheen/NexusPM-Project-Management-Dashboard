import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken, makeAuthCookie } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
    const { email, password } = await request.json();
    if (!email || !password) return Response.json({ error: 'Email and password are required' }, { status: 400 });

    const db = await getDb();
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    const user = result.rows[0] as any;

    if (!user || !(await bcrypt.compare(password, user.password_hash as string))) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ id: user.id as string, email: user.email as string, name: (user.name ?? user.email) as string });
    return Response.json(
        { id: user.id, email: user.email, name: user.name },
        { headers: { 'Set-Cookie': makeAuthCookie(token) } }
    );
};

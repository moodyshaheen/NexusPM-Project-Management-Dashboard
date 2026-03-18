import type { APIRoute } from 'astro';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export const GET: APIRoute = ({ request }) => {
    const token = getTokenFromRequest(request);
    if (!token) return Response.json({ error: 'Unauthenticated' }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return Response.json({ error: 'Invalid token' }, { status: 401 });

    return Response.json(user);
};

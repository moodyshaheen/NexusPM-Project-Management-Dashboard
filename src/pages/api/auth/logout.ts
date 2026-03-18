import type { APIRoute } from 'astro';
import { clearAuthCookie } from '@/lib/auth';

export const POST: APIRoute = () => {
    return Response.json({ success: true }, { headers: { 'Set-Cookie': clearAuthCookie() } });
};

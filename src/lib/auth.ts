import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'nexuspm-dev-secret-change-in-production';
const COOKIE = 'nexuspm_token';

export function signToken(payload: { id: string; email: string; name: string }) {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { id: string; email: string; name: string } | null {
    try {
        return jwt.verify(token, SECRET) as { id: string; email: string; name: string };
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request: Request): string | null {
    const cookie = request.headers.get('cookie') ?? '';
    const match = cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
    return match?.[1] ?? null;
}

export function makeAuthCookie(token: string) {
    return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`;
}

export function clearAuthCookie() {
    return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE };

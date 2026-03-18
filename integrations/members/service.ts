import { Member } from './types';

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const data = await res.json();
    return {
      _id: data.id,
      loginEmail: data.email,
      profile: { nickname: data.name },
      status: 'APPROVED',
    };
  } catch {
    return null;
  }
};

export const loginUser = async (email: string, password: string): Promise<Member> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Login failed');
  }
  const data = await res.json();
  return { _id: data.id, loginEmail: data.email, profile: { nickname: data.name }, status: 'APPROVED' };
};

export const registerUser = async (email: string, password: string, name: string): Promise<Member> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Registration failed');
  }
  const data = await res.json();
  return { _id: data.id, loginEmail: data.email, profile: { nickname: data.name }, status: 'APPROVED' };
};

export const logoutUser = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST' });
};

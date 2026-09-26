import type { UserType } from "@/types";

const TOKEN_KEY = 'financyToken';
const USER_KEY = 'financyUser';
const AUTHENTICATION_USER_KEY = 'financyAuthenticationUser';

// -----------------------------------------------------------------------------

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// -----------------------------------------------------------------------------

export function getUser(): UserType | null {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) as UserType : null
}

export function saveUser(user: UserType): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

// -----------------------------------------------------------------------------

export function getRememberMe(): { email: string; password: string } | null {
  const data = localStorage.getItem(AUTHENTICATION_USER_KEY);
  if (!data) return null;
  const jsonData = JSON.parse(data) as { email: string; password: string };
  if (typeof jsonData.email === 'string' && typeof jsonData.password === 'string') {
    return jsonData;
  }
  return null;
}

export function saveRememberMe({email, password}: {email: string, password: string}): void {
  localStorage.setItem(AUTHENTICATION_USER_KEY, JSON.stringify({ email, password }));
}

export function clearRememberMe(): void {
  localStorage.removeItem(AUTHENTICATION_USER_KEY);
}
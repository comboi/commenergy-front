const AUTH_TOKEN_COOKIE = 'auth-token';
const AUTH_EVENT_STORAGE_KEY = 'commenergy.auth-event';
const LOGIN_ROUTE = '/platform/auth/login';
const PLATFORM_HOME_ROUTE = '/platform';

const PUBLIC_ROUTE_SUFFIXES = [
  '/platform/auth/login',
  '/platform/auth/register',
  '/platform/auth/forgot-password',
  '/platform/auth/reset-password',
] as const;

const PUBLIC_EXACT_ROUTES = new Set(['/']);

export const SESSION_EVENT = {
  loggedIn: 'auth:logged-in',
  loggedOut: 'auth:logged-out',
  expired: 'auth:expired',
} as const;

export type SessionEventType =
  (typeof SESSION_EVENT)[keyof typeof SESSION_EVENT];

export function isPublicRoute(pathname: string) {
  return (
    PUBLIC_EXACT_ROUTES.has(pathname) ||
    PUBLIC_ROUTE_SUFFIXES.some((route) => pathname.endsWith(route))
  );
}

function broadcastSessionEvent(type: SessionEventType) {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = JSON.stringify({ type, timestamp: Date.now() });

  window.dispatchEvent(new CustomEvent('commenergy:session', { detail: { type } }));
  window.localStorage.setItem(AUTH_EVENT_STORAGE_KEY, payload);
}

export function getAuthToken() {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${AUTH_TOKEN_COOKIE}=`)
  );

  if (!authCookie) {
    return null;
  }

  return decodeURIComponent(authCookie.split('=').slice(1).join('='));
}

export function setAuthToken(token: string) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  broadcastSessionEvent(SESSION_EVENT.loggedIn);
}

export function clearAuthToken(type: SessionEventType = SESSION_EVENT.loggedOut) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  broadcastSessionEvent(type);
}

export {
  AUTH_EVENT_STORAGE_KEY,
  AUTH_TOKEN_COOKIE,
  LOGIN_ROUTE,
  PLATFORM_HOME_ROUTE,
};

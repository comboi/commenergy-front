import {
  LOGIN_ROUTE,
  PLATFORM_HOME_ROUTE,
  isPublicRoute,
} from '@/lib/session';

describe('session route guards', () => {
  it('recognises public auth routes', () => {
    expect(isPublicRoute('/')).toBe(true);
    expect(isPublicRoute(LOGIN_ROUTE)).toBe(true);
    expect(isPublicRoute('/platform/auth/register')).toBe(true);
    expect(isPublicRoute('/platform/auth/forgot-password')).toBe(true);
    expect(isPublicRoute('/platform/auth/reset-password')).toBe(true);
  });

  it('recognises private app routes', () => {
    expect(isPublicRoute(PLATFORM_HOME_ROUTE)).toBe(false);
    expect(isPublicRoute('/platform/contracts')).toBe(false);
    expect(isPublicRoute('/platform/communities/123')).toBe(false);
  });
});

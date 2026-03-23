import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
  AUTH_TOKEN_COOKIE,
  LOGIN_ROUTE,
  PLATFORM_HOME_ROUTE,
  isPublicRoute,
} from '@/lib/session';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get(AUTH_TOKEN_COOKIE);
  const pathname = request.nextUrl.pathname;
  const publicRoute = isPublicRoute(pathname);

  if (!isAuthenticated && !publicRoute) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  if (isAuthenticated && publicRoute) {
    return NextResponse.redirect(new URL(PLATFORM_HOME_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

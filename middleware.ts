import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth-token');
  const isAuthPage =
    request.nextUrl.pathname.endsWith('/login') ||
    request.nextUrl.pathname.endsWith('/register') ||
    request.nextUrl.pathname.endsWith('/forgot-password') ||
    request.nextUrl.pathname.endsWith('/reset-password') ||
    request.nextUrl.pathname === '/';

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/platform/auth/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/platform', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

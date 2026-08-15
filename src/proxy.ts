import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'sparke_admin_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    // If already logged in and visiting /admin/login, redirect to /admin dashboard
    if (isLoginPage) {
      if (token && token.includes('.')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // For all other protected admin routes (/admin, /admin/orders, /admin/products, /admin/vouchers, etc.)
    if (!token || !token.includes('.')) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Keep export for backwards compatibility
export const middleware = proxy;

export const config = {
  matcher: ['/admin/:path*'],
};

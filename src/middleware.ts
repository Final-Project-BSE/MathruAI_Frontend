import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is trying to access dashboard
  const isDashboard = pathname.startsWith('/dashboard');
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session-admin-getJob')?.value;
  
  // If accessing dashboard without session, redirect to sign-in
  if (isDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // If has session and trying to access sign-in, redirect to dashboard
  if (pathname === '/sign-in' && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard/reproductive', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in'],
};
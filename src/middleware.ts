import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getDashboardForRole, canAccessRoute } from '@/lib/roleConfig';

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);

type SessionUser = {
  email: string;
  token: string;
  roles: string[];
};

type SessionPayload = {
  user: SessionUser;
  expires: Date;
  createdAt: Date;
};

async function getSessionFromCookie(sessionCookie: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(sessionCookie, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session-admin-getJob')?.value;
  
  // Check if accessing dashboard
  const isDashboard = pathname.startsWith('/dashboard');
  
  // Trying to access dashboard without session
  if (isDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Trying to access sign-in with valid session
  if (pathname === '/sign-in' && sessionCookie) {
    const session = await getSessionFromCookie(sessionCookie);
    
    if (session?.user?.roles && session.user.roles.length > 0) {
      const userRole = session.user.roles[0];
      const dashboardPath = getDashboardForRole(userRole);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }
  
  // Accessing dashboard with session
  if (isDashboard && sessionCookie) {
    const session = await getSessionFromCookie(sessionCookie);
    
    if (!session?.user?.roles || session.user.roles.length === 0) {
      // Invalid session
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    
    const userRole = session.user.roles[0];
    
    // Check if user can access this specific route
    if (!canAccessRoute(userRole, pathname)) {
      // User doesn't have access, redirect to their dashboard
      const authorizedDashboard = getDashboardForRole(userRole);
      return NextResponse.redirect(new URL(authorizedDashboard, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in'],
};
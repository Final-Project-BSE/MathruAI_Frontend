import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { canAccessRoute, getDashboardForRole } from "@/lib/roleConfig";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);

type SessionUser = {
  email: string;
  token: string;
  roles: string[];
};

type SessionPayload = {
  user: SessionUser;
  expires: string | Date;
  createdAt: string | Date;
};

const protectedPrefixes = [
  "/dashboard",
  "/cycle-tracker",
  "/health-monitoring",
  "/daily-recommendations",
  "/midwife-assign",
  "/chatbot",
  "/health-records",
  "/timeline-milestone",
  "/announcement",
  "/recovery-tracking",
  "/breastfeeding-support",
  "/three-posha",
  "/birth-control",
  "/midwife",
  "/user-assign",
  "/notifications",
  "/settings",
  "/admin",
];

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

async function getSessionFromCookie(
  sessionCookie: string
): Promise<SessionPayload | null> {
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
  const sessionCookie = request.cookies.get("session-admin-getJob")?.value;

  const isSignInPage = pathname === "/sign-in";
  const isProtected = isProtectedRoute(pathname);

  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isSignInPage && sessionCookie) {
    const session = await getSessionFromCookie(sessionCookie);

    if (session?.user?.roles?.length) {
      const userRole = session.user.roles[0];
      const dashboardPath = getDashboardForRole(userRole);

      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  if (isProtected && sessionCookie) {
    const session = await getSessionFromCookie(sessionCookie);

    if (!session?.user?.roles?.length) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const userRole = session.user.roles[0];

    if (!canAccessRoute(userRole, pathname)) {
      const authorizedDashboard = getDashboardForRole(userRole);

      return NextResponse.redirect(new URL(authorizedDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/dashboard/:path*",
    "/cycle-tracker/:path*",
    "/health-monitoring/:path*",
    "/daily-recommendations/:path*",
    "/midwife-assign/:path*",
    "/chatbot/:path*",
    "/health-records/:path*",
    "/timeline-milestone/:path*",
    "/announcement/:path*",
    "/recovery-tracking/:path*",
    "/breastfeeding-support/:path*",
    "/three-posha/:path*",
    "/birth-control/:path*",
    "/midwife/:path*",
    "/user-assign/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
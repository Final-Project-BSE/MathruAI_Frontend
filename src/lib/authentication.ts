"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { signIn as signInAction } from "@/actions/auth";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);

type User = {
  email: string;
  token: string;
  roles: string[];
};

type Session = {
  user: User;
  expires: Date;
  createdAt: Date;
};

async function encrypt(payload: Session): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8 hours")
    .sign(key);
}

async function decrypt(input: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as any;
  } catch {
    return null;
  }
}

export async function login(data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  try {
    // Call backend API (this now returns the correct structure)
    const res = await signInAction({
      email: data.email,
      password: data.password,
    });

    console.log("Auth library received:", JSON.stringify(res, null, 2));

    // Check if login failed
    if (res.status === "FAIL" || !res.data) {
      return {
        status: "FAIL" as const,
        message: res.message || "Login failed",
        data: null,
      };
    }

    // Validate required fields
    if (!res.data.email || !res.data.token || !res.data.roles || res.data.roles.length === 0) {
      console.error("Invalid data structure:", res.data);
      return {
        status: "FAIL" as const,
        message: "Invalid user data. Please contact support.",
        data: null,
      };
    }

    // Create user object (data is already in correct format from signInAction)
    const user: User = {
      email: res.data.email,
      token: res.data.token,
      roles: res.data.roles,
    };

    console.log("Creating session for user:", user);

    // Set expiration
    const expires = data.rememberMe
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
      : new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 hours

    const createdAt = new Date();
    
    // Create session
    const session: Session = { user, expires, createdAt };
    const sessionToken = await encrypt(session);

    // Set cookie
    const cookiesStore = await cookies();
    cookiesStore.set("session-admin-getJob", sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log("Session created successfully");

    return {
      status: "SUCCESS" as const,
      message: "Login successful",
      data: user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: "FAIL" as const,
      message: "An unexpected error occurred during login",
      data: null,
    };
  }
}

export async function logout() {
  const cookiesStore = await cookies();
  cookiesStore.delete("session-admin-getJob");
}

export async function getSession(): Promise<Session | null> {
  const cookiesStore = await cookies();
  const sessionCookie = cookiesStore.get("session-admin-getJob")?.value;
  
  if (!sessionCookie) return null;
  
  return await decrypt(sessionCookie);
}

// Get primary user role
export async function getUserRole(): Promise<string | null> {
  const session = await getSession();
  if (!session?.user?.roles || session.user.roles.length === 0) {
    return null;
  }
  return session.user.roles[0];
}

// Check if user has specific role
export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession();
  if (!session?.user?.roles) return false;
  return session.user.roles.includes(role);
}

// Get all user roles
export async function getUserRoles(): Promise<string[]> {
  const session = await getSession();
  return session?.user?.roles || [];
}
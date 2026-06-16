"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import {
  signIn as signInAction,
  forgetPasswordRequest,
} from "@/actions/auth";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);

// type User = {
//   email: string;
//   token: string;
//   roles: string[];
// };

// type Session = {
//   user: User;
//   expires: Date;
//   createdAt: Date;
// };

export type User = {
  email: string;
  token: string;
  roles: string[];
};

export type Session = {
  user: User;
  expires: string;
  createdAt: string;
};

async function encrypt(payload: Session): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // Call backend API
    const res = await signInAction({
      email: data.email,
      password: data.password,
    });

    console.log("Auth library received:", JSON.stringify(res, null, 2));

    if (res.status === "FAIL" || !res.data) {
      return {
        status: "FAIL" as const,
        message: res.message || "Login failed",
        data: null,
      };
    }

    if (!res.data.email || !res.data.token || !res.data.roles || res.data.roles.length === 0) {
      console.error("Invalid data structure:", res.data);
      return {
        status: "FAIL" as const,
        message: "Invalid user data. Please contact support.",
        data: null,
      };
    }

    // Create user object
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

    const session: Session = {
      user,
      expires: expires.toISOString(),
      createdAt: new Date().toISOString(),
    };
    const sessionToken = await encrypt(session);

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

export async function getUserRole(): Promise<string | null> {
  const session = await getSession();
  if (!session?.user?.roles || session.user.roles.length === 0) {
    return null;
  }
  return session.user.roles[0];
}

export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession();
  if (!session?.user?.roles) return false;
  return session.user.roles.includes(role);
}

export async function getUserRoles(): Promise<string[]> {
  const session = await getSession();
  return session?.user?.roles || [];
}

export async function forgotPassword(data: { email: string }) {
  try {
    const res = await forgetPasswordRequest(data.email);

    if (res.status === "FAIL") {
      return {
        status: "FAIL" as const,
        message: res.message || "Failed to send reset email",
        data: null,
      };
    }

    return {
      status: "SUCCESS" as const,
      message: res.message || "Password reset link sent to your email",
      data: res.data ?? null,
    };
  } catch (error) {
    console.error("Forgot password error:", error);

    return {
      status: "FAIL" as const,
      message: "Something went wrong. Please try again later.",
      data: null,
    };
  }
}
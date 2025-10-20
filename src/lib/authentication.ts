"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { signIn as signInAction } from "@/actions/auth";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8 hours")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function login(data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const res = await signInAction({
    email: data.email,
    password: data.password,
  });

  if (res.status === "FAIL") {
    return res;
  }

  // Map the response structure from your API
  const user = {
    id: res.data?._id || "",
    name: `${res.data?.firstName || ""} ${res.data?.lastName || ""}`.trim(),
    email: res.data?.email || "",
    token: res.data?.idToken || "",
    refreshToken: res.data?.refreshToken || null,
    privileges: res.data?.privileges || [],
    firstName: res.data?.firstName || "",
    lastName: res.data?.lastName || "",
    isActive: res.data?.isActive || false,
  };

  const expires = data.rememberMe
    ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    : new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 hours
  
  const createdAt = new Date(Date.now());
  const session = await encrypt({ user, expires, createdAt });

  const cookiesStore = await cookies();
  cookiesStore.set("session-admin-getJob", session, { 
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return {
    status: "SUCCESS",
    message: "Login successful",
    data: user,
  };
}

export async function logout() {
  const cookiesStore = await cookies();
  cookiesStore.set("session-admin-getJob", "", { expires: new Date(0) });
}

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
    refreshToken: string | null;
    privileges: string[];
    firstName?: string;
    lastName?: string;
    isActive: boolean;
  };
  expires: Date;
  createdAt: Date;
};

export async function getSession(): Promise<Session | null> {
  const cookiesStore = await cookies();
  const sessionCookie = cookiesStore.get("session-admin-getJob")?.value;
  if (!sessionCookie) return null;
  const decrypted = await decrypt(sessionCookie);
  return decrypted;
}

export async function updateSession(request: any) {
  const session = request.cookies.get("session-admin-getJob")?.value;
  if (!session) return null;

  const decrypted = await decrypt(session);
  if (!decrypted) return null;

  return decrypted;
}
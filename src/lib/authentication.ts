// "use server"
// import { cookies } from "next/headers"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// // import { SignJWT, jwtVerify } from "jose"
// // import { signIn } from "@/actions/auth"

// const secretKey = process.env.JWT_SECRET || "secret123"
// const key = new TextEncoder().encode(secretKey)

// export async function encrypt(payload: any) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("8 hours")
//     .sign(key)
// }

// export async function decrypt(input: string): Promise<any> {
//   try {
//     const { payload } = await jwtVerify(input, key, {
//       algorithms: ["HS256"],
//       requiredClaims: ["iat", "exp"],
//     })
//     return payload
//   } catch {
//     return null
//   }
// }

// export async function login(data: {
//   email: string
//   password: string
//   rememberMe?: boolean
//   deviceToken?: string
//   deviceType?: string
// }) {
//   const res = await signIn({
//     identifier: data.email,
//     password: data.password,
//     rememberMe: data.rememberMe || false,
//     deviceToken: data.deviceToken || undefined, // changed from null to undefined
//   deviceType: data.deviceType || undefined, 
//   })

//   if (res.status === "FAIL") {
//     return res
//   }

//   // Map the response structure from your API
//   const user = {
//     id: res.data?.user?.id,
//     name: `${res.data?.user?.firstName || ""} ${res.data?.user?.lastName || ""}`.trim(),
//     email: res.data?.user?.email,
//     token: res.data?.tokens?.accessToken,
//     refreshToken: res.data?.tokens?.refreshToken ?? null,
//     privileges: res.data?.user?.role ? [res.data.user.role] : [],
//     isSuperAdmin: res.data?.user?.role === "SUPER_ADMIN",
//     firstName: res.data?.user?.firstName,
//     lastName: res.data?.user?.lastName,
//     role: res.data?.user?.role,
//     avatar: res.data?.user?.avatar,
//     phoneNumber: res.data?.user?.phoneNumber,
//   }

//   const expires = res.data?.tokens?.refreshToken
//     ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
//     : new Date(Date.now() + 1000 * 60 * 60 * 8)
//   const createdAt = new Date(Date.now())
//   const session = await encrypt({ user, expires, createdAt })

//   const cookiesStore = await cookies()
//   cookiesStore.set("session-admin-getJob", session, { expires })

//   return {
//     status: "SUCCESS",
//     message: "Login successful",
//     data: user,
//   }
// }

// export async function logout() {
//   const cookiesStore = await cookies()
//   cookiesStore.set("session-admin-getJob", "", { expires: new Date(0) })
// }

// export type Session = {
//   user: {
//     id: string
//     name: string
//     email: string
//     token: string
//     refreshToken: string | null
//     adminType?: "superAdmin" | "admin"
//     profilePicture?: string
//     privileges: string[]
//     isSuperAdmin: boolean
//     firstName?: string
//     lastName?: string
//     role?: string
//     avatar?: string
//     phoneNumber?: string
//   }
//   expires: Date
//   createdAt: Date
// }

// export async function getSession(): Promise<Session | null> {
//   const cookiesStore = await cookies()
//   const sessionCookie = cookiesStore.get("session-admin-getJob")?.value
//   if (!sessionCookie) return null
//   const decrypted = await decrypt(sessionCookie)
//   return decrypted
// }

// export async function getSessionData(): Promise<Session | null> {
//   const cookiesStore = await cookies()
//   const session = cookiesStore.get("session-admin-getJob")?.value
//   if (!session) return null
//   const decrypted = await decrypt(session)
//   return decrypted
// }

// export async function updateSession(request: NextRequest) {
//   const session = request.cookies.get("session-admin-getJob")?.value
//   if (!session) {
//     return NextResponse.redirect(new URL("/sign-in", request.url))
//   }

//   const decrypted = await decrypt(session)
//   if (!decrypted) {
//     return NextResponse.redirect(new URL("/sign-in", request.url))
//   }

//   const response = NextResponse.next()
//   return response
// }

// export async function updateProfilePictureInSession(profilePicture: string) {
//   const session = await getSession()
//   if (!session) {
//     return null
//   }

//   session.user.profilePicture = profilePicture
//   const expires = new Date(session.expires)
//   const newSession = await encrypt(session)
//   const cookiesStore = await cookies()
//   cookiesStore.set("session-admin-getJob", newSession, { expires })
//   return session
// }

// export const updateAccessTokenInSession = async (accessToken: string, p0: string) => {
//   const session = await getSession()
//   if (!session || !accessToken) {
//     return null
//   }

//   session.user.token = accessToken
//   const expires = new Date(session.expires)
//   const newSession = await encrypt(session)
//   const cookiesStore = await cookies()
//   cookiesStore.set("session-admin-getJob", newSession, { expires })
//   console.log("Access token updated")
//   return session
// }

// // New function to update admin data in session after admin update
// export const updateAdminDataInSession = async (updatedAdminData: any) => {
//   const session = await getSession()
//   if (!session) {
//     return null
//   }

//   // Update user data in session with new admin data
//   if (updatedAdminData.firstName) session.user.firstName = updatedAdminData.firstName
//   if (updatedAdminData.lastName) session.user.lastName = updatedAdminData.lastName
//   if (updatedAdminData.email) session.user.email = updatedAdminData.email
//   if (updatedAdminData.role) session.user.role = updatedAdminData.role
//   if (updatedAdminData.roles) session.user.privileges = updatedAdminData.roles

//   // Update name field
//   session.user.name = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim()

//   const expires = new Date(session.expires)
//   const newSession = await encrypt(session)
//   const cookiesStore = await cookies()
//   cookiesStore.set("session-admin-getJob", newSession, { expires })

//   console.log("Admin session data updated successfully")
//   return session
// }

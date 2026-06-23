import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
    role?: "ADMIN"
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string
    role?: "ADMIN"
  }
}

export type ApiResponse<T> =
  | { success: true; data: T; meta?: { total: number; page: number; limit: number } }
  | { success: false; error: string; code?: string }

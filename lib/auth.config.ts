import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // populated with Credentials in Node.js-compatible auth.ts
  session: {
    strategy: "jwt" as const,
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as "ADMIN"
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role ?? "ADMIN"
        session.user.id = token.id ?? ""
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const userRole = auth?.user?.role
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")
      const isLoginRoute = nextUrl.pathname === "/admin/login"

      // Admin routes require login + ADMIN role
      if (isAdminRoute && !isLoginRoute) {
        if (!isLoggedIn || userRole !== "ADMIN") return false
      }

      // Redirect authenticated admins away from the login page
      if (isLoginRoute && isLoggedIn && userRole === "ADMIN") {
        return Response.redirect(new URL("/admin", nextUrl))
      }

      return true
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], // empty array, will be populated with Credentials in Node.js-compatible auth.ts
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id as string;
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")
      const isLoginRoute = nextUrl.pathname === "/admin/login"

      if (isAdminRoute && !isLoginRoute) {
        return isLoggedIn
      }
      
      if (isLoginRoute && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl))
      }

      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

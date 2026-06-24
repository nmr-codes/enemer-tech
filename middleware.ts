import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as any)?.role
  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginRoute = pathname === "/admin/login"

  // Block unauthenticated or non-ADMIN users from all /admin/** routes
  if (isAdminRoute && !isLoginRoute) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      const loginUrl = new URL("/admin/login", req.nextUrl)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated admins away from the login page
  if (isLoginRoute && isLoggedIn && userRole === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  // Build response with security headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  )

  // Visitor analytics tracking for public pages (fire-and-forget)
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    const referrer = req.headers.get("referer") || ""
    const userAgent = req.headers.get("user-agent") || ""

    fetch(`${req.nextUrl.origin}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer, userAgent }),
    }).catch(() => {})
  }

  return response
})

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}

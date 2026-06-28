"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, Lock, AlertTriangle, Loader2, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      })

      if (result?.error) {
        setError("Invalid email or password. Access denied.")
        setShake(true)
        setTimeout(() => setShake(false), 600)
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch {
      setError("A connection error occurred. Please try again.")
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex overflow-hidden">
      {/* ── Left Panel: Branding ──────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(0,95,232,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.15) 0%, transparent 50%), #020817",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-600/20 blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-sky-400/15 blur-[60px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Abdurasul CMS</span>
        </div>

        {/* Center hero art */}
        <div className="relative z-10 space-y-8">
          {/* 3D shield display */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-2xl animate-pulse" />
              <div
                className="absolute inset-4 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #60a5fa, #005fe8 50%, #003fa0)",
                  boxShadow:
                    "0 0 60px rgba(0,95,232,0.5), inset 0 -10px 30px rgba(0,0,0,0.4), inset 10px 10px 30px rgba(255,255,255,0.12)",
                }}
              >
                <Lock className="h-12 w-12 text-white/90" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Secure Admin Portal
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto">
              Your personal CMS for managing posts, projects, messages, and site settings.
            </p>
          </div>

          {/* Security badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "🔒 JWT Secured",
              "⚡ Role-Based Access",
              "🛡️ bcrypt Encryption",
            ].map((badge) => (
              <span
                key={badge}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-neutral-600 text-xs">
          © {new Date().getFullYear()} Abdurasul Nematxonov. All rights reserved.
        </div>
      </div>

      {/* ── Right Panel: Login Form ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(0,95,232,0.2) 0%, transparent 60%), #030712",
          }}
        />

        <div
          className={`relative z-10 w-full max-w-md transition-all duration-300 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={mounted ? { opacity: 1, transform: "translateY(0)" } : { opacity: 0, transform: "translateY(16px)" }}
        >
          {/* Card */}
          <div
            className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}
          >
            {/* Top gradient bar */}
            <div className="h-[2px] bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600" />

            <div className="p-8 space-y-7">
              {/* Header */}
              <div className="space-y-1">
                {/* Mobile logo */}
                <div className="flex items-center gap-2 mb-4 lg:hidden">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">Abdurasul CMS</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Sign in</h2>
                <p className="text-sm text-neutral-400">
                  Enter your admin credentials to continue
                </p>
              </div>

              {/* Error alert */}
              {error && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: loading
                      ? "rgba(0,95,232,0.5)"
                      : "linear-gradient(135deg, #005fe8, #0080ff)",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(0,95,232,0.35)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Sign in securely
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-neutral-500">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/admin" })}
                  className="w-full py-2.5 px-6 rounded-xl font-medium text-sm text-neutral-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/admin" })}
                  className="w-full py-2.5 px-6 rounded-xl font-medium text-sm text-neutral-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  Sign in with GitHub
                </button>
                <button
                  type="button"
                  disabled={!email || loading}
                  onClick={() => signIn("nodemailer", { email, callbackUrl: "/admin" })}
                  className="w-full py-2.5 px-6 rounded-xl font-medium text-sm text-neutral-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Magic Link (Type Email Above)
                </button>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-600">
                <ShieldCheck className="h-3 w-3" />
                <span>256-bit encrypted · Sessions expire in 8 hours</span>
              </div>
            </div>
          </div>

          {/* Back to site link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              ← Back to public site
            </a>
          </div>
        </div>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  )
}

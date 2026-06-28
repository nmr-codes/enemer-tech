"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Loader2, ChevronLeft } from "lucide-react"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleProviderLogin = async (provider: "google" | "github" | "nodemailer") => {
    setLoading(provider)
    try {
      await signIn(provider, { 
        email: provider === "nodemailer" ? email : undefined,
        callbackUrl 
      })
    } catch (error) {
      console.error(error)
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto pt-12 pb-24 px-4 sm:px-6 animate-[fadeIn_0.4s_ease-out]">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors mb-8">
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.16)] rounded-3xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand/10 dark:bg-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 100 100" className="h-6 w-6 text-brand" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 12 L85 30 L85 70 L50 88 L15 70 L15 30 Z" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
              <path d="M38 62 L62 38" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <circle cx="38" cy="38" r="6" fill="currentColor" />
              <circle cx="62" cy="62" r="6" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Sign in or create an account to continue.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleProviderLogin("google")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-sm"
          >
            {loading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <button
            onClick={() => handleProviderLogin("github")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-sm"
          >
            {loading === "github" ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            )}
            Continue with GitHub
          </button>

          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-neutral-200 dark:border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-[11px] font-bold tracking-widest uppercase text-neutral-400">OR</span>
            <div className="flex-grow border-t border-neutral-200 dark:border-white/10"></div>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={!!loading}
              className="w-full px-4 py-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleProviderLogin("nodemailer")}
              disabled={!email || !!loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm text-white bg-brand hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(0,95,232,0.35)]"
            >
              {loading === "nodemailer" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Send Magic Link
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default function PublicLoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-24"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>}>
      <LoginForm />
    </Suspense>
  )
}

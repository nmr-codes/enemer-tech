"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Moon, ShieldAlert } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        setError("Invalid email or password. Please try again.")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 px-4">
      {/* Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand via-brand-hover to-cyan-500" />
        
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center border border-neutral-700 mb-2">
            <Moon className="h-6 w-6 text-brand" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Admin CMS Login
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Enter your credentials to access the portfolio dashboard
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@domain.com"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-950/60 border-neutral-800 text-white placeholder-neutral-500 focus-visible:ring-brand"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-950/60 border-neutral-800 text-white placeholder-neutral-500 focus-visible:ring-brand"
              />
            </div>
          </CardContent>

          <CardFooter className="pb-8 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand to-brand-hover hover:from-brand-hover hover:to-brand text-white font-medium py-2 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

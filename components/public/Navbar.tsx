"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.projects"), href: "/projects" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  return (
    <nav
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${scrolled
          ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg shadow-[0_1px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)] border-b border-neutral-100/60 dark:border-neutral-900/60"
          : "bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md border-b border-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg
              viewBox="0 0 100 100"
              className="h-7 w-7 text-brand transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 12 L85 30 L85 70 L50 88 L15 70 L15 30 Z"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M38 62 L62 38"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="38" cy="38" r="5.5" fill="currentColor" />
              <circle cx="62" cy="62" r="5.5" fill="currentColor" />
            </svg>
            <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white group-hover:text-brand transition-colors duration-200">
              Abdurasul Nematxonov
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                      ? "text-brand"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    }`}
                >
                  {link.name}
                  {/* Active animated underline pill */}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4/5 rounded-full bg-brand animate-[fadeIn_0.2s_ease]" />
                  )}
                </Link>
              )
            })}
            <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-2" />
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-1 animate-[slideDown_0.2s_ease]">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "text-brand bg-brand/5 dark:bg-brand/10"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  }`}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />}
                {link.name}
              </Link>
            )
          })}
          <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 w-full my-2" />
          <div className="flex items-center justify-between px-3">
            <span className="text-sm font-medium text-neutral-500">Language</span>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  )
}

"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import en from "@/locales/en.json"
import uz from "@/locales/uz.json"

export type Locale = "en" | "uz"

interface LanguageContextProps {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

const translations: Record<Locale, any> = { en, uz }

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale === "en" || savedLocale === "uz") {
      setLocaleState(savedLocale)
    } else {
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "uz") {
        setLocaleState("uz")
      }
    }
    setIsMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let current: any = translations[locale]

    for (const k of keys) {
      if (current === undefined || current[k] === undefined) {
        // Fallback to English
        let enFallback: any = translations["en"]
        for (const fallbackK of keys) {
          if (enFallback === undefined || enFallback[fallbackK] === undefined) {
            return key
          }
          enFallback = enFallback[fallbackK]
        }
        return enFallback
      }
      current = current[k]
    }

    return typeof current === "string" ? current : key
  }

  // Prevent hydration mismatches by returning a placeholder or empty content until client mount
  if (!isMounted) {
    // Return language provider with fallback English values during SSR
    return (
      <LanguageContext.Provider value={{ locale: "en", setLocale, t: (key) => key }}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

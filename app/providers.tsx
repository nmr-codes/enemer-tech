"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/context/LanguageContext"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  )
}

"use client"

import { useLanguage } from "@/context/LanguageContext"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5 bg-neutral-50 dark:bg-neutral-900">
      <button
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          locale === "en"
            ? "bg-white dark:bg-neutral-800 text-brand shadow-sm"
            : "text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-250"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("uz")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          locale === "uz"
            ? "bg-white dark:bg-neutral-800 text-brand shadow-sm"
            : "text-neutral-500 hover:text-neutral-850 dark:hover:text-neutral-250"
        }`}
      >
        UZ
      </button>
    </div>
  )
}

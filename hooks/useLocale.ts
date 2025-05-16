// Updated useLocale hook implementation
import { create } from "zustand"

interface LocaleStore {
  locale: string
  setLocale: (locale: string) => void
  previousLocale: string | null
  listeners: Set<() => void>
  subscribe: (listener: () => void) => () => void
}

export const useLocale = create<LocaleStore>((set, get) => ({
  locale: typeof window !== "undefined" ? localStorage.getItem("locale") || "uz-UZ" : "uz-UZ",
  previousLocale: null,
  listeners: new Set<() => void>(),

  setLocale: (locale) => {
    set((state) => ({
      locale,
      previousLocale: state.locale, // Track the previous locale
    }))

    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale)
    }

    // Notify all listeners about the locale change
    get().listeners.forEach((listener) => listener())
  },

  subscribe: (listener) => {
    get().listeners.add(listener)
    return () => {
      get().listeners.delete(listener)
    }
  },
}))

// Helper function to get locale prefix ('uz', 'ru', 'en') from locale string ('uz-UZ', 'ru-RU', 'en-US')
export const getLocalePrefix = (locale: string): string => {
  return locale.split("-")[0]
}

// Helper function to convert locale prefix to full locale
export const expandLocalePrefix = (prefix: string): string => {
  const localeMap: Record<string, string> = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  }

  return localeMap[prefix] || "uz-UZ" // Default to uz-UZ if not found
}

// Updated useLocale hook implementation
import { create } from "zustand";

interface LocaleStore {
  locale: string;
  setLocale: (locale: string) => void;
  previousLocale: string | null;
}

export const useLocale = create<LocaleStore>((set) => ({
  locale: typeof window !== "undefined" ? localStorage.getItem("locale") || "uz-UZ" : "uz-UZ",
  previousLocale: null,
  setLocale: (locale) => {
    set((state) => ({ 
      locale,
      previousLocale: state.locale // Track the previous locale
    }));
    
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
  },
}));

// Helper function to get locale prefix ('uz', 'ru', 'en') from locale string ('uz-UZ', 'ru-RU', 'en-US')
export const getLocalePrefix = (locale: string): string => {
  return locale.split('-')[0];
};

// Helper function to convert locale prefix to full locale
export const expandLocalePrefix = (prefix: string): string => {
  const localeMap: Record<string, string> = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US',
  };
  
  return localeMap[prefix] || 'uz-UZ'; // Default to uz-UZ if not found
};
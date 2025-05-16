"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/[locale]/dashboard/_components/ui/select"
import { type Locale, routing, usePathname, useRouter } from "../../app/i18n/routing" // useRouter bu yerdan import qilinadi

type Props = {
  defaultValue: string
  label: string
}
import { useLocale } from "@/hooks/useLocale" // Qo‘shildi
import { useSession, useStore } from "@/hooks/useSession"
export default function LocaleSwitcherSelect({ defaultValue, label }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const setLocale = useLocale((state) => state.setLocale) // Qo‘shildi

  function onSelectChange(nextLocale: string) {
    const localeMap: Record<string, string> = {
      uz: "uz-UZ",
      ru: "ru-RU",
      en: "en-US",
    }

    // First update the locale in the store
    setLocale(localeMap[nextLocale] || "uz-UZ")

    // Get current path and check if we're in the new-order page
    const isNewOrderPage = pathname.includes("/dashboard/new-order")

    // For new-order page with query parameters, handle differently to avoid full reload
    if (isNewOrderPage && pathname.includes("?serviceId=")) {
      // Update URL without full navigation for new-order page
      // This will be handled by the useEffect in the new-order page
      const currentPath = pathname.split("/").slice(2).join("/")
      router.replace({ pathname: `/${nextLocale}/${currentPath}` }, { scroll: false })

      // Refresh data if needed
      const token = useSession.getState().session?.token
      if (token) {
        useStore.getState().fetchData(token)
      }
    } else {
      // For other pages, use the standard navigation
      router.replace({ pathname }, { locale: nextLocale as Locale })

      // Refresh data if needed
      const token = useSession.getState().session?.token
      if (token) {
        useStore.getState().fetchData(token)
      }
    }
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger
        className="w-[70px] h-8 border-none bg-transparent focus:ring-0 focus:ring-offset-0"
        aria-label={label}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

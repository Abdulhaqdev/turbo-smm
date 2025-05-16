"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingCart, LayoutGrid, Wallet, Receipt } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "@/hooks/useLocale"

export function MobileNavigation() {
  const pathname = usePathname()
  const t = useTranslations("MobileNavigation")
  const { locale } = useLocale()

  // Get locale prefix (e.g., 'uz', 'ru', 'en')
  const localePrefix = locale.split("-")[0].toLowerCase()

  const routes = [
    {
      label: t("newOrder"),
      icon: ShoppingCart,
      href: `/${localePrefix}/dashboard/new-order`,
      active: pathname === `/${localePrefix}/dashboard/new-order`,
    },
    {
      label: t("services"),
      icon: LayoutGrid,
      href: `/${localePrefix}/dashboard/services`,
      active: pathname === `/${localePrefix}/dashboard/services`,
    },
    {
      label: t("addFunds"),
      icon: Wallet,
      href: `/${localePrefix}/dashboard/add-funds`,
      active: pathname === `/${localePrefix}/dashboard/add-funds`,
    },
    {
      label: t("orders"),
      icon: Receipt,
      href: `/${localePrefix}/dashboard/orders`,
      active: pathname === `/${localePrefix}/dashboard/orders`,
    },
  ]

  return (
    <>
      {/* Spacer div to prevent content from being hidden behind mobile navigation */}
      <div className="h-16 lg:hidden" aria-hidden="true" />

      {/* Mobile navigation */}
      <div className={cn("fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-[#101013] lg:hidden")}>
        <nav className="flex h-16 items-center justify-around ">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 text-[10px]",
                route.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              <span className="mt-1">{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
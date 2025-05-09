"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingCart, LayoutGrid, Wallet,  Receipt } from "lucide-react"


export function MobileNavigation( ) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Yangi  buyurtma",
      icon: ShoppingCart,
      href: "/dashboard/new-order",
      active: pathname === "/new-order",
    },
    {
      label: "Xizmatlar",
      icon: LayoutGrid,
      href: "/dashboard/services",
      active: pathname === "/services",
    },
    {
      label: "Hisobni to'ldirish",
      icon: Wallet,
      href: "/dashboard/add-funds",
      active: pathname === "/add-funds",
    },
    {
      label: "Buyurtmalar",
      icon: Receipt,
      href: "/dashboard/orders",
      active:
        pathname === "/dashboard/orders"  },
  ]

  return (
    <>
      {/* Spacer div to prevent content from being hidden behind mobile navigation */}
      <div className="h-16 lg:hidden" aria-hidden="true" />

      {/* Mobile navigation */}
      <div className={cn("fixed bottom-0 left-0 right-0 z-50 border-t bg-black lg:hidden ", )}>
        <nav className="flex h-16 items-center justify-around">
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


"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Home, ShoppingCart, CreditCard, Package } from "lucide-react"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { user } = useStore()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Add Funds", href: "/dashboard/add-funds", icon: CreditCard },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              OrderSystem
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted px-3 py-1 text-sm">Balance: ${user.balance.toFixed(2)}</div>
            <div className="text-sm">{user.name}</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden">
        <nav className="flex h-16 items-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-2 text-xs",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="mt-1">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}


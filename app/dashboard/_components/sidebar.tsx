"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingCart, LayoutGrid, Wallet, Receipt, LifeBuoy } from "lucide-react";
import { Instagram, Send, Twitter, Youtube, Facebook } from "lucide-react";
import TiktokIcon from './icons/tiktok-icon';
import { UserAccountNav } from './account/user-account-nav';
import Image from 'next/image';

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Yangi buyurtma",
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
      active: pathname === "/orders",
    },
    {
      label: "Yordam",
      icon: LifeBuoy,
      href: "/dashboard/support",
      active: pathname === "/support",
    },
  ];

  return (
    <div className={cn("fixed left-0 top-0 bottom-0 z-40 flex w-64 flex-col border-r bg-card", className)} {...props}>
      <div className="flex h-16 items-center border-b px-6">
        <Link className="dark:flex hidden items-center space-x-2" href="/">
          <Image src="/logo.svg" alt="logo" width={150} height={20} />
        </Link>
        <Link className="dark:hidden flex items-center space-x-2" href="/">
          <Image src="/turbosmm.svg" alt="logo" width={150} height={20} />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:text-primary",
                route.active && "bg-muted/50 text-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <UserAccountNav />
      </div>
    </div>
  );
}

export function getSocialIcon(iconName: string) {
  switch (iconName) {
    case "instagram":
      return Instagram;
    case "tiktok":
      return TiktokIcon;
    case "telegram":
    case "send":
      return Send;
    case "twitter":
      return Twitter;
    case "youtube":
      return Youtube;
    case "facebook":
      return Facebook;
    default:
      return LayoutGrid;
  }
}
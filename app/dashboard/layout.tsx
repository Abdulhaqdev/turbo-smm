// app/(root)/dashboard/layout.tsx
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Sidebar } from './_components/sidebar';
import { MobileNavigation } from './_components/mobile-navigation';

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
      <div className={`flex min-h-screen flex-col md:flex-row ${inter.className}`}>
        <Sidebar className="hidden md:flex" />
        <main className="flex-1  md:ml-64">{children}</main>
        <MobileNavigation  />
      </div>
  );
}
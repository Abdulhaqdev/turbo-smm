"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { NAV_LINKS, navLinks } from "@/constants"; // Ensure both imports are correct
import { usePathname } from "next/navigation"; // Import usePathname

export default function Navbar() {
  const pathname = usePathname(); // Get the current route

  return (
    <>
      {/* Top Navbar (Sticky at the top, visible on all screens) */}
      <nav className="sticky  inset-0 top-0 z-50 w-full bg-opacity-40 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link className="flex items-center space-x-2" href="/">
              <Image src="/logo.svg" alt="logo" width={150} height={20} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-blue-500 ${
                  pathname === link.href ? "text-blue-500 font-bold" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button className="bg-blue-600 rounded-lg text-white hover:bg-blue-700">
              Boshlash
            </Button>
          </div>

          {/* Mobile Navigation (Top - "Boshlash" button only) */}
          <div className="md:hidden">
            <Button className="bg-blue-600 rounded-lg text-white hover:bg-blue-700">
              Boshlash
            </Button>
          </div>
        </div>
      </nav>

      {/* Bottom Navbar (Fixed at the bottom, visible only on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-3 border-t border-gray-800 bg-black md:hidden py-4">
        
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center gap-1 px-2 ${
            pathname === link.href ? "text-blue-500" : ""
          }`}        >
          <Image
            src={link.icon}
            width={25}
            height={25}
            alt={link.label}
          
          />
          <span
            className={`text-xs ${
              pathname === link.href ? "text-blue-500" : "text-white"
            }`}
          >
            {link.label}
          </span>
        </Link>
      ))}
    </div>
    </>
  );
}
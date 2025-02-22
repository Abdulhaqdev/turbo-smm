"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { NAV_LINKS } from "@/constants"	

export default function Navbar() {
  return (
    <nav className="sticky inset-0 top-0 z-50 w-full  bg-opacity-40 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/logo.svg" alt="logo" width={150} height={20}  />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-white transition-colors hover:text-blue-500">
              {link.label}
            </Link>
          ))}
          <Button className="bg-blue-600 rounded-lg text-white hover:bg-blue-700">Boshlash</Button>
        </div>
        {/* Mobile Navigation */}
				<div className='md:hidden'>
			   	<Button className="bg-blue-600 rounded-lg text-white hover:bg-blue-700">Boshlash</Button>
				</div>
      </div>
    </nav>
  )
}


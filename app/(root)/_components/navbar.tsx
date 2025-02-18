"use client"

import * as React from "react"
import Link from "next/link"
// import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { NAV_LINKS } from '@/constants'
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
	// const [isOpen, setIsOpen] = React.useState(false)

	return (
		<nav className="sticky inset-0 top-0 z-50 w-full bg-black bg-opacity-40 backdrop-blur-md">
			<div className="container flex h-20 items-center">
				<div className="mr-4 flex">
					<Link className="flex items-center space-x-2" href="/">
						<Image src={'/logo.svg' } alt='logo' width={150} height={20}/>
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
					<div className="hidden font-sans space-x-6  md:flex md:items-center md:space-x-10">
					{NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-white transition-colors hover:text-blue-500">
                {link.label}
              </Link>
            ))}
						<div className='pl-4'>
						<Button className="bg-blue-600 ml-4 rounded-lg text-white hover:bg-blue-700">Boshlash</Button>
						</div>
					</div>
					{/* <Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="outline" size="icon" className="border-0 text-white hover:bg-gray-800">
								<Menu className="h-6 w-6" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] bg-black p-6">
							<div className="flex flex-col space-y-6">
								<Link
									href="/"
									className="text-blue-500 transition-colors hover:text-blue-400"
									onClick={() => setIsOpen(false)}
								>
									Home
								</Link>
								<Link
									href="/service"
									className="text-white transition-colors hover:text-gray-300"
									onClick={() => setIsOpen(false)}
								>
									Service
								</Link>
								<Link
									href="/about"
									className="text-white transition-colors hover:text-gray-300"
									onClick={() => setIsOpen(false)}
								>
									Biz Haqimizda
								</Link>
								<Link
									href="/login"
									className="text-white transition-colors hover:text-gray-300"
									onClick={() => setIsOpen(false)}
								>
									Kirish
								</Link>
								<Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>
									Boshlash
								</Button>
							</div>
						</SheetContent>
					</Sheet> */}
				</div>
			</div>
		</nav>
	)
}


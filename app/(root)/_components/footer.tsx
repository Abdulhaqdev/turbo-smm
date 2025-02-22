import Image from 'next/image'
import Link from "next/link"

export default function Footer() {
  return (
    <footer className=" border-gray-800 ">
      <div className="container px-4 py-12 md:px-6">
        <div className="mb-12 text-start max-w-3xl">
				<Link className="flex items-center space-x-2" href="/">
						<Image src={'/logo.svg' } alt='logo' width={150} height={20}/>
					</Link>
          <p className="mt-4 text-gray-400">
            Created by TURBO SMM, with a clean design and high-quality components and templates. An ideal choice for
            your SMM panel.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:grid-cols-2 lg:grid-cols-4 border-t border-gray-800 pt-8 md:flex-row">
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-300 hover:text-white">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Service Terms
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">Developers</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/api" className="text-gray-300 hover:text-white">
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">Pages</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-gray-300 hover:text-white">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between  border-t border-gray-800 pt-8 md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">© 2024 TURBO SMM All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
              Privacy policy
            </Link>
            <Link href="/updates" className="text-sm text-gray-400 hover:text-white">
              Update List
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


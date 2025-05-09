import Image from 'next/image'
import Link from "next/link"

export default function Footer() {
  return (
    <footer id='footer' className=" border-gray-800  max-w-screen-xl mx-auto">
      <div className="container   mb-14 md:mb-10 md:px-6">
        <div className="mb-12 text-start max-w-3xl">
				<Link className="flex items-center space-x-2" href="/">
						<Image src={'/logo.svg' } alt='logo' width={150} height={20}/>
					</Link>
          <p className="mt-4 dark:text-gray-400 text-black">
            Created by TURBO SMM, with a clean design and high-quality components and templates. An ideal choice for
            your SMM panel.
          </p>
        </div>
        <div className="grid  md:text-start grid-cols-2 gap-6 md:gap-12 md:grid-cols-2 lg:grid-cols-4 border-t border-gray-800 pt-8 md:flex-row">
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" >
                  Home
                </Link>
              </li>
              <li>
                <Link href="/signup" >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/services" >
                  Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">Company</h3>
            <ul className="space-y-4 dark:text-gray-400 text-black">
              <li>
                <Link href="/terms" className=" ">
                  Service Terms
                </Link>
              </li>
              <li>
                <Link href="/about" className="">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className=" ">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className=' '>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">Developers</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/api" >
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div className=''>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">Pages</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="dark:text-gray-400 text-black hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/service" className="dark:text-gray-400 text-black hover:text-white">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="dark:text-gray-400 text-black hover:text-white">
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


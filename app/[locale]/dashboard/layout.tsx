import { ReactNode, use } from 'react'
import { Inter } from 'next/font/google'
import { Sidebar } from './_components/sidebar'
import { MobileNavigation } from './_components/mobile-navigation'
import SessionProvider from '@/components/provider/session-provider'
import getSession from '@/app/actions/session'
// import getSession from '../actions/session'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const session = use(getSession())

	return (
		<SessionProvider session={session}>
			<div
				className={`flex min-h-screen flex-col md:flex-row ${inter.className}`}
			>
				<Sidebar className='hidden lg:flex' />
				<main className='flex-1  lg:ml-64'>{children}</main>
				<MobileNavigation />
			</div>
		</SessionProvider>
	)
}

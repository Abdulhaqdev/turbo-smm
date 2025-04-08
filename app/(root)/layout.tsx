import Navbar from '../_components/headers/navbar'
import Footer from '../_components/footers/footer'
import { use } from 'react'
import getSession from '../actions/session'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = use(getSession())

	console.log(session)
	return (
		<div>
			<Navbar />
			<main className='min-h-screen'>{children}</main>
			<Footer />
		</div>
	)
}

import Navbar from '../_components/headers/navbar'
import Footer from '../_components/footers/footer'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div>
			<Navbar />
			<main className='min-h-screen'>{children}</main>
			<Footer />
		</div>
	)
}

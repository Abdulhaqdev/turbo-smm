import Footer from '@/app/_components/footers/footer'
import Navbar from '@/app/_components/headers/navbar'

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

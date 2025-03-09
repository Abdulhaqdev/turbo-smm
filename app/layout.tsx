import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import { ChilndProps } from '@/types'
import Navbar from './(root)/_components/headers/navbar'
import Footer from './(root)/_components/footers/footer'
import { ThemeProvider } from '@/components/provider/theme-provider'

const noto_sans = Noto_Sans({
	variable: '--font-noto-sans',
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600'],
})

export const metadata: Metadata = {
	title: "Turbo smm Ijtimoiy tarmoqlarda tez o'sish",
	description:
		"Ijtimoiy tarmoqlarda tez va samarali o'sish uchun bizning yuqori sifatli xizmatlarimizdan foydalaning. Ko'proq obunachilar, layklar yoki ko'rishlarni effektivligiga bo'lgan tez va ishonchli tarzda ta'minlaymiz. Minimal ta'sir o'tkazadigan bizga ishoning, real auditoriya orqali o'sishni ta'minlang! Barcha ijtimoiy tarmoqlar uchun qo'llanilishining qandoy ekanligini ko'zating!",
}

function RootLayout({ children }: ChilndProps) {
	return (
		<html lang='en' suppressHydrationWarning className='scroll-smooth'>
			<body id="top"
				className={` ${noto_sans.variable}  dark:bg-[#101013]   overflow-x-hidden`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout

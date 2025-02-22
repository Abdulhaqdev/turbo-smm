import { ChilndProps } from '@/types'
import React from 'react'
import Navbar from './_components/navbar'
import Hero from './_components/hero'
import Feature from './_components/feature'
import PaymentMethods from './_components/paymentsmethod'
import HowItWorks from './_components/howitworks'
import ToolsSection from './_components/tools'
import Testimonials from './_components/testimonials'
import FAQSection from './_components/faq'
import Footer from './_components/footer'

function Layout({ children }: ChilndProps) {
	return (
		<main className='bg-[#101013]'>
			<Navbar />
			<Hero/>
			<Feature/>
			<PaymentMethods/>
			<HowItWorks/>
			<ToolsSection/>
			<Testimonials/>
			<FAQSection/>
			<Footer/>
			<div>{children}</div>
		</main>
	)
}

export default Layout

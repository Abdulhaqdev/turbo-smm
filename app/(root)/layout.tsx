import { ChilndProps } from '@/types'
import React from 'react'
import Hero from './_components/hero'
import Feature from './_components/feature'
import PaymentMethods from './_components/paymentsmethod'
import HowItWorks from './_components/howitworks'
// import ToolsSection from './_components/tools'
import Testimonials from './_components/testimonials'
import FAQSection from './_components/faq'

function Layout({ children }: ChilndProps) {
	return (
		<main className='bg-background 	 mx-auto'>
			<Hero/>
			<Feature/>
			<PaymentMethods/>
			<HowItWorks/>
			<Testimonials/>
			<FAQSection/>
			<div>{children}</div>
		</main>
	)
}

export default Layout

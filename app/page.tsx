import React from 'react'
// import Feature from '../_components/features/feature'
// import PaymentMethods from '../_components/paymentsmethod'
import HowItWorks from './_components/features/howitworks'
import Testimonials from './_components/testimonials'
import FAQSection from './_components/footers/faq'
import HeroAboutus from './_components/heroes/hero'
import PaymentMethods from './_components/paymentsmethod'
import Feature from './_components/features/feature'
import Navbar from './_components/headers/navbar'

function page() {
	return (
		<div>
			<Navbar/>
			<HeroAboutus />
			<Feature />
			<PaymentMethods />
			<HowItWorks />
			<Testimonials />
			<FAQSection />
		</div>
	)
}

export default page

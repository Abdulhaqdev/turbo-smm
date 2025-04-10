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
// import { Toaster } from 'react-hot-toast'

function page() {
	return (
		<div>
        {/* <Toaster position='top-center' reverseOrder={false}> */}


			<Navbar/>
			<HeroAboutus />
			<Feature />
			<PaymentMethods />
			<HowItWorks />
			<Testimonials />
			<FAQSection />
				{/* </Toaster> */}
		</div>
	)
}

export default page

// import Feature from '../_components/features/feature'
// import PaymentMethods from '../_components/paymentsmethod'
import Feature from '../_components/features/feature'
import HowItWorks from '../_components/features/howitworks'
import FAQSection from '../_components/footers/faq'
import Footer from '../_components/footers/footer'
import Navbar from '../_components/headers/navbar'
import HeroAboutus from '../_components/heroes/hero'
import PaymentMethods from '../_components/paymentsmethod'
import Testimonials from '../_components/testimonials'
// import { Toaster } from 'react-hot-toast'

function page() {
	return (
		<div>
			{/* <Toaster position='top-center' reverseOrder={false}> */}
			<Navbar />
			<HeroAboutus />
			<Feature />
			<PaymentMethods />
			<HowItWorks />
			<Testimonials />
			<FAQSection />
			<Footer/>
			{/* </Toaster> */}
		</div>
	)
}

export default page

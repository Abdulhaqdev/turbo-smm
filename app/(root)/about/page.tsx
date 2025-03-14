import Feature from '../_components/features/feature'
import HowItWorks from '../_components/features/howitworks'
import HeroAboutus from '../_components/heroes/hero-aboutus'
import HeroSupport from '../_components/heroes/hero-support'
import HeroTestimonials from '../_components/heroes/hero-testimonials'

function page() {
	return (
		<>
			<HeroAboutus />
			<Feature />
			<HowItWorks />
			<HeroSupport />
			<HeroTestimonials />
		</>
	)
}

export default page

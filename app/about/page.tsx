import Feature from '../(root)/_components/features/feature'
import HowItWorks from '../(root)/_components/features/howitworks'
import HeroAboutus from '../(root)/_components/heroes/hero-aboutus'
import HeroSupport from '../(root)/_components/heroes/hero-support'
import HeroTestimonials from '../(root)/_components/heroes/hero-testimonials'

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

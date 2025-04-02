import Feature from '@/app/_components/features/feature'
import HowItWorks from '@/app/_components/features/howitworks'
import HeroAboutus from '@/app/_components/heroes/hero-aboutus'
import HeroSupport from '@/app/_components/heroes/hero-support'
import HeroTestimonials from '@/app/_components/heroes/hero-testimonials'


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

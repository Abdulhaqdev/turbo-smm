 'use client'
 
 import { useRef } from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';

export default function PaymentMethods() {
	const autoplayRef = useRef(
		Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
	);

	const paymentLogos = [
		{ name: 'Uzumbank', src: '/payments/Uzum.svg' },
		{ name: 'Click', src: '/payments/Click.svg' },
		{ name: 'Kapital Bank', src: '/payments/Kapitalbank.svg' },
		{ name: 'TBC Bank', src: '/payments/Tbc.svg' },
		{ name: 'SmartBank', src: '/payments/Smartbank.svg' },
		{ name: 'Apelsin', src: '/payments/Apelsin.svg' },
		{ name: 'SQB', src: '/payments/Sqb.svg' },
		{ name: 'InfinBank', src: '/payments/Infinback.svg' },
		{ name: 'Payme', src: '/payments/Payme.svg' },
		{ name: 'Aloqa Bank', src: '/payments/Aloqabank.svg' },
		{ name: 'Anor Bank', src: '/payments/Octo.svg' },
		{ name: 'MBank', src: '/payments/Mk.svg' },
	];

	return (
		<section className='py-16 md:py-24'>
			<div className='max-w-screen-2xl  mx-auto px-20'>
				<div className='mb-12 flex flex-col items-center text-center'>
					<Image src={'/Icon.svg'} width={40} height={40} alt='icon' className='mb-6' />
					<h2 className='mb-4 text-3xl font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent md:text-4xl'>
						{` Xavfsiz va Moslashuvchan To'lov Variantlari`}
					</h2>
					<p className='max-w-2xl text-slate-400'>
						{`Biz sizga xavfsiz va qulay tranzaksiya tajribasini ta'minlash uchun turli to'lov usullarini taklif etamiz.
						Kredit va debet kartalari, banklar va boshqa variantlar orasidan tanlang. Sizning qulayligingiz va
						xavfsizligingiz biz uchun birinchi o'rinda.`}
					</p>
				</div>
				<Carousel opts={{ align: 'start' }} plugins={[autoplayRef.current]} className='w-full'>
					<CarouselContent>
						{paymentLogos.map(logo => (
							<CarouselItem key={logo.name} className='md:basis-1/3 lg:basis-1/5'>
								<div className='flex items-center justify-center'>
									<div className='group relative h-12 w-full'>
										<div className='absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-110'>
											<Image src={logo.src || '/placeholder.svg'} alt={`${logo.name} logo`} fill className='object-contain brightness-0 invert opacity-75 transition-opacity hover:opacity-100' />
										</div> 
									</div>
								</div>
                {/* <div className='flex items-center justify-end'>
									<div className='group relative h-12 w-full'>
										<div className='absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-110'>
											<Image src={logo.src || '/placeholder.svg'} alt={`${logo.name} logo`} fill className='object-contain brightness-0 invert opacity-75 transition-opacity hover:opacity-100' />
										</div>
									</div>
								</div> */}
							</CarouselItem>
						))}
					</CarouselContent> 
				</Carousel>
        <Carousel opts={{ align: 'start' }} plugins={[autoplayRef.current]} className='w-full'>
					<CarouselContent>
						{paymentLogos.map(logo => (
							<CarouselItem key={logo.name} className='md:basis-1/2 lg:basis-1/6'>
								<div className='flex items-center justify-center'>
									<div className='group relative h-12 w-full'>
										<div className='absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-110'>
											<Image src={logo.src || '/placeholder.svg'} alt={`${logo.name} logo`} fill className='object-contain brightness-0 invert opacity-75 transition-opacity hover:opacity-100' />
										</div>
									</div>
								</div>
							</CarouselItem>
						))}
					</CarouselContent> 
				</Carousel>
				{/* <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6'>
					{paymentLogos.map(logo => (
						<div key={logo.name} className='flex items-center justify-center'>
							<div className='group relative h-12 w-full'>
								<div className='absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-110'>
									<Image src={logo.src || '/placeholder.svg'} alt={`${logo.name} logo`} fill className='object-contain brightness-0 invert opacity-75 transition-opacity hover:opacity-100' />
								</div>
							</div>
						</div>
					))}
				</div> */}
			</div>
		</section>
	);
}

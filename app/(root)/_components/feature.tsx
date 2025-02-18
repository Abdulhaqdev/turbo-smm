'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Facebook,  Instagram, Linkedin, Twitch, Twitter, Youtube } from 'lucide-react'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

const socialPlatforms = [
	{ name: 'Twitter', icon: <Twitter className='mr-2 h-5 w-5' /> },
	{ name: 'Instagram', icon: <Instagram className='mr-2 h-5 w-5' /> },
	{ name: 'Twitch', icon: <Twitch className='mr-2 h-5 w-5' /> },
	{ name: 'Youtube', icon: <Youtube className='mr-2 h-5 w-5' /> },
	{ name: 'Facebook', icon: <Facebook className='mr-2 h-5 w-5' /> },
	{ name: 'LinkedIn', icon: <Linkedin className='mr-2 h-5 w-5' /> },
	{ name: 'TikTok', icon: <Instagram className='mr-2 h-5 w-5' /> },
	{ name: 'Snapchat', icon: <Instagram className='mr-2 h-5 w-5' /> },
	{ name: 'Pinterest', icon: <Instagram className='mr-2 h-5 w-5' /> },
	{ name: 'Reddit', icon: <Instagram className='mr-2 h-5 w-5' /> },
];

function CountUpAnimation({ end , duration = 2000, prefix = '', suffix = '' }) {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const startTime = Date.now()
		const endCount = Number(end)

		const updateCount = () => {
			const now = Date.now()
			const progress = Math.min((now - startTime) / duration, 1)

			setCount(Math.floor(endCount * progress))

			if (progress < 1) {
				requestAnimationFrame(updateCount)
			}
		}

		requestAnimationFrame(updateCount)
	}, [end, duration])

	return (
		<span>
			{prefix}
			{count.toLocaleString()}
			{suffix}
		</span>
	)
}

export default function Feature() {
	return (
		<main className='bg-black  max-h-screen '>
			<div className='mx-auto max-w-3xl text-center'>
				<div className='mb-6 flex justify-center'>
					<Image src={'./vector.svg'} height={48} width={48} alt='vector' />
				</div>
				<h1 className='mb-6 text-3xl font-bold leading-tight md:text-5xl bg-gradient-to-r from-[#60A5FA] to-[#9333EA] bg-clip-text text-transparent'>
					{`O'zbekiston bo'ylab
					ijtimoiy tarmoqlarda o'sish uchun ishonchli xizmat.`}
				</h1>

				<p className='mb-12 px-6 text-lg text-slate-400'>
					{` Qoniqarli mijozlar tarmog'iga qo'shiling. Bizning platformamiz har 0.20 soniyada bir buyurtmani yakunlaydi va
          raqobatbardosh xizmatlarimiz 1 000 dona uchun 1 000 so'mdan boshlanadi. Biz O'zbekistondagi barcha hududlarda
          muvaffaqiyatli faoliyat yuritamiz. Bugungi qo'shiling va eng sifatli ijtimoiy tarmoq xizmatlaridan
          foydalaning!`}
				</p>

				<div className='mb-16 grid grid-cols-1 gap-1 mx-10 md:grid-cols-3'>
					<div className='text-center'>
						<p className='text-xl font-bold text-white'>
							<CountUpAnimation end={100} duration={1500} suffix=' sec' />
						</p>
						<p className='text-sm text-gray-400'>Har bir buyurtma uchun</p>
					</div>
					<div className='text-center'>
						<p className='text-xl font-bold text-white'>
							<CountUpAnimation end={120167} duration={2000} />
						</p>
						<p className='text-sm text-gray-400'>Buyurtma yakunlandi</p>
					</div>
					<div className='text-center'>
						<p className='text-xl font-bold text-white'>
							<CountUpAnimation
								end={1000}
								duration={1500}
								suffix=' UZS/1,000'
							/>
						</p>
						<p className='text-sm text-gray-400'>Narxlar boshlanadi</p>
					</div>
				</div>
				<Carousel
					opts={{
						align: 'start',
					}}
					plugins={[
						Autoplay({
							delay:2000,
						}),
					]}
					orientation='vertical'
					className='w-full max-w-md mx-auto'
				>
					<CarouselContent className=' h-[240px] '>
						{socialPlatforms.map((platform, index) => (
							<CarouselItem key={index} className=' md:basis-1/5'>
								<Button
									variant='outline'
									size='lg'
									className='w-full border-gray-800 rounded-xl bg-gray-900/50 text-white hover:bg-gray-800'
								>
									{platform.icon} {platform.name}
								</Button>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</main>
	)
}

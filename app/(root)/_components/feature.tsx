'use client'

import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
import {
	Facebook,
	Instagram,
	Linkedin,
	Twitch,
	Twitter,
	Youtube,
} from 'lucide-react'
import Image from 'next/image'
import { CountUpAnimationProps } from '@/types'

const socialPlatforms = [
	{ name: 'Twitter', icon: <Twitter className='mr-2 h-5 w-5' /> },
	{ name: 'Instagram', icon: <Instagram className='mr-2 h-5 w-5' /> },
	{ name: 'Twitch', icon: <Twitch className='mr-2 h-5 w-5' /> },
	{ name: 'Youtube', icon: <Youtube className='mr-2 h-5 w-5' /> },
	{ name: 'Facebook', icon: <Facebook className='mr-2 h-5 w-5' /> },
	{ name: 'LinkedIn', icon: <Linkedin className='mr-2 h-5 w-5' /> },
]

function CountUpAnimation({
	end,
	duration = 3000,
	prefix = '',
	suffix = '',
}: CountUpAnimationProps) {
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
		<main className='my-10'>
			<div className='mx-auto  max-w-3xl text-center'>
				<div className='mb-6 flex justify-center'>
					<Image src={'./vector.svg'} height={48} width={48} alt='vector' />
				</div>
				<h1 className='mb-6 text-2xl font-bold leading-tight md:text-5xl bg-gradient-to-r from-[#60A5FA] to-[#9333EA] bg-clip-text text-transparent'>
					{`O'zbekiston bo'ylab ijtimoiy tarmoqlarda o'sish uchun ishonchli xizmat.`}
				</h1>
				<p className='mb-12 px-6 text-sm md:text-lg text-slate-400'>
					{`Qoniqarli mijozlar tarmog'iga qo'shiling. Bizning platformamiz har 0.20 soniyada bir buyurtmani yakunlaydi va raqobatbardosh xizmatlarimiz 1 000 dona uchun 1 000 so'mdan boshlanadi.`}
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
				{/* Marquee Container */}
				<div className='relative w-full max-w-lg px-4 h-80 mx-auto overflow-hidden'>
					{/* Marquee animatsiyasi */}
					<div className='vertical-marquee flex gap-4'>
						{socialPlatforms.map((platform, index) => (
							<div
								key={index}
								className='bg-[#18181B] text-white flex rounded-lg justify-center items-center py-3'
							>
								{platform.icon} {platform.name}
							</div>
						))}
						{socialPlatforms.map((platform, index) => (
							<div
								key={index}
								className='bg-[#18181B] text-white rounded-lg flex justify-center items-center py-3'
							>
								{platform.icon} {platform.name}
							</div>
						))}
					</div>
					<div className='absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#101013] to-transparent pointer-events-none'></div>
				</div>
			</div>
		</main>
	)
}

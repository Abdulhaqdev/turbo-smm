'use client'

import Image from 'next/image'

const paymentLogos = [
	{ name: 'Uzumbank', src: '/payments/Uzum.svg' },
	{ name: 'Click', src: '/payments/Click.svg' },
	{ name: 'Kapital Bank', src: '/payments/Kapitalbank.svg' },
	{ name: 'TBC Bank', src: '/payments/Tbc.svg' },
	{ name: 'SmartBank', src: '/payments/Smartbank.svg' },
	{ name: 'Apelsin', src: '/payments/Apelsin.svg' },

]
const paymentLogos2 = [
	{ name: 'SQB', src: '/payments/Sqb.svg' },
	{ name: 'InfinBank', src: '/payments/Infinback.svg' },
	{ name: 'Payme', src: '/payments/Payme.svg' },
	{ name: 'Aloqa Bank', src: '/payments/Aloqabank.svg' },
	{ name: 'Anor Bank', src: '/payments/Octo.svg' },
	{ name: 'MBank', src: '/payments/Mk.svg' },
]


export default function PaymentMethods() {
	return (
		<section className='py-16 md:py-24 '>
			<div className='container mx-auto max-w-screen-2xl md:px-20'>
				<div className='mb-12 flex flex-col items-center text-center'>
					<Image
						src='/Icon.svg'
						width={40}
						height={40}
						alt='icon'
						className='mb-6'
					/>
					<h2 className='mb-4 text-2xl font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent md:text-4xl'>
						{`Xavfsiz va Moslashuvchan To'lov Variantlari`}
					</h2>
					<p className='max-w-2xl text-slate-400'>
						{`Biz sizga xavfsiz va qulay tranzaksiya tajribasini ta'minlash uchun turli to'lov usullarini taklif etamiz.
            Kredit va debet kartalari, banklar va boshqa variantlar orasidan tanlang. Sizning qulayligingiz va xavfsizligingiz biz uchun birinchi o'rinda.`}
					</p>
				</div>

				{/* Marquee Container */}
				<div className='relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-[#101013] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-[#101013] after:to-transparent'>
					{/* Marquee Content 1 */}
					<div className=' horizontal-marquee flex gap-8 py-1'>
						{/* First set of logos */}
						{paymentLogos.map((logo, index) => (
							<div
								key={index}
								className='flex h-16 w-32 shrink-0 items-center justify-center'
							>
								<Image
									src={logo.src || '/placeholder.svg'}
									alt={`${logo.name} logo`}
									width={100}
									height={40}
									style={{ width: 'auto', height: 'auto' }}
									className='object-contain brightness-0 invert'
								/>
							</div>
						))}
						{/* Duplicate set for seamless loop */}
						{paymentLogos.map((logo, index) => (
							<div
								key={`copy-${index}`}
								className='flex h-16 w-32 shrink-0 items-center justify-center'
							>
								<Image
									src={logo.src || '/placeholder.svg'}
									alt={`${logo.name} logo`}
									width={100}
									height={40}
									style={{ width: 'auto', height: 'auto' }}
									className='object-contain brightness-0 invert  '
								/>
							</div>
						))}
					</div>

					{/* Marquee Content 2 */}
          <div className=' horizontal-marquee flex gap-8 pl-12 py-1'>
						{/* First set of logos */}
						{paymentLogos2.map((logo, index) => (
							<div
								key={index}
								className='flex h-16 w-32 shrink-0 items-center justify-center'
							>
								<Image
									src={logo.src || '/placeholder.svg'}
									alt={`${logo.name} logo`}
									width={100}
									height={40}
									style={{ width: 'auto', height: 'auto' }}
									className='object-contain brightness-0 invert '
								/>
							</div>
						))}
						{/* Duplicate set for seamless loop */}
						{paymentLogos2.map((logo, index) => (
							<div
								key={`copy-${index}`}
								className='flex h-16 w-32 shrink-0 items-center justify-center'
							>
								<Image
									src={logo.src || '/placeholder.svg'}
									alt={`${logo.name} logo`}
									width={100}
									height={40}
									style={{ width: 'auto', height: 'auto' }}
									className='object-contain brightness-0 invert  '
								/>
							</div>
						))}
					</div>
				</div>
				{/* <div className="horizontal-marquee grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {paymentLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 transition-all duration-300 hover:scale-110"
            >
              <Image
                src={logo.src || "/placeholder.svg"}
                alt={`${logo.name} logo`}
                width={100}
                height={40}
                style={{ width: "auto", height: "auto" }}
                className="object-contain brightness-0 invert opacity-75 transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div> */}
			</div>
		</section>
	)
}

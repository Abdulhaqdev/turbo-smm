import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
	{
		name: 'Dildora Karimova',
		title: 'Mahalliy brend agenti',
		quote:
			"Instagram'da kontentni rivojlantirish uchun auditoriya kerak edi. TURBO SMM yordamida haqiqiy mijozlar bizni topdi va bizlar sotuvlar ham oshdi!",
	},
	{
		name: 'Jamshed Rakmatullayev',
		title: 'YouTube kanali yaratuvchi',
		quote:
			"Kanalimni yangi ochganimda, lekin videolar ko'rishlarini qanday oshirishni bilmasdim. TURBO SMM yordamida organik obunachilarimiz miqdori sezilarli darajada oshdi!",
	},
	{
		name: 'Muhlisa Qodirova',
		title: 'TikTok blogger (food & lifestyle)',
		quote:
			"TikTok'da videolariimni ko'rishlarini oshirish uchun TURBO SMM ko'mak olishni xohladim. Endi videolariim rekomendatsiyaga tushayapti!",
	},
	{
		name: 'Sherzod Ismoilov',
		title: 'Instagram marketing mutaxassisi',
		quote:
			"Mijozlarimizni safini tashkil etish va rivojlantirish uchun safar SMM zamonaviy etyozi bor edi. TURBO SMM - eng yaxshi tanlov bo'ldi, natijalari juda tez va samarali!",
	},
	{
		name: 'Nosiba Orolava',
		title: "Go'zallik salon egasi",
		quote:
			'Salonimga mijozlar jalb qilish uchun yangi usullar kerak edi. TURBO SMM mening Instagram orqali obunachilar va mijozlar soni sezilarli darajada oshdi!',
	},
	{
		name: 'Bekzod Yoqubov',
		title: 'Telegram kanal yaruvchisi',
		quote:
			"Kanalni ochganimda odamiylar qo'shilmayotgani. TURBO SMM orqali tezda kerakli obunachilar soniga yetdim va hazir orgnik ravishda ham o'sayapti, bundan juda hursandman!",
	},
	{
		name: 'Gulbahor Sobirova',
		title: 'Fashion Blogger (Instagram)',
		quote:
			'Brendlar bilan hamkorlik qilishim uchun followerlar sonini oshirishim kerak edi. TURBO SMM orqali mening auditoriyam sezilarli darajada oshdi va endi brendlar men bilan ishlashni xohlayapti!',
	},
	{
		name: 'Sanjar Abdudopirov',
		title: 'Rags studiyasi egasi (TikTok & Instagram)',
		quote:
			"Rags darholaniy to'g'ri oshirish uchun TURBO SMM yordamga murojaat qildim. Instagram va TikTok'dagi obunachilarimiz soni sezilarli oshdi!",
	},
	{
		name: 'Farangiz Shokirova',
		title: "Onlayn do'kon egasi (Aksessuarlar)",
		quote:
			"Sotuvlarimni juda oshirish uchun TURBO SMM'dagi xizmatlardan foydalandim. Endi mening onlayn do'konim savdosi va buyurtmalar soni ancha oshgan!",
	},
]

export default function Testimonials() {
	return (
		<div className='container py-20 max-w-screen-xl mx-auto'>
			<div className='flex flex-col items-center justify-center space-y-4 text-center'>
				<h2 className='text-3xl font-bold tracking-tighter  dark:text-white sm:text-4xl md:text-5xl'>
					Mijozlarimizdan eshiting
				</h2>
				<p className='mx-auto max-w-[700px] text-gray-400 md:text-lg'>
					{`Bizning mijozlarimiz xizmatlarimiz haqida nima deb aytishini ko'ring. Biz ajoyib natijalar va yuqori
          mijozlar mamnuniyatini ta'minlashda faxrlanamiz.`}
				</p>
			</div>
			<div className='mx-auto mt-12 grid gap-6'>
				{/* Desktop: Show all 9 cards in a 3x3 grid */}
				<div className='hidden lg:grid lg:grid-cols-3 gap-6'>
					{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className='relative dark:border-2 rounded-xl shadow-sm  border-[#27272d] dark:bg-[#101013] bg-white'
						>
							<CardContent className='py-4'>
								<div className='relative z-10'>
									<div className='mb-4 dark:border-b-2 border-[#27272d] '>
										<div className='flex justify-between'>
											<h3 className='text-xl font-semibold dark:text-white text-black'>
												{testimonial.name}
                      </h3>
												<svg
													className='h-12 w-12 text-slate-400'
													fill='currentColor'
													viewBox='0 0 32 32'
													aria-hidden='true'
												>
													<path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
												</svg>
											
										</div>
										<p className='text-slate-400/80 text-sm mb-2'>
											{testimonial.title}
										</p>
									</div>
									<blockquote className='text-sm leading-6 dark:text-white text-black'>
										{testimonial.quote}
									</blockquote>
								</div>
								{/* <div className="absolute right-6 w-10 h-10 top-5">
                  <svg
                    className="h-12 w-12 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div> */}
							</CardContent>
						</Card>
					))}
				</div>

				{/* Tablet: Show 8 cards in a 2-column grid */}
				<div className='hidden md:grid md:grid-cols-2 lg:hidden gap-6'>
				{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className='relative dark:border-2 rounded-xl shadow-sm  border-[#27272d] dark:bg-[#101013] bg-white'
						>
							<CardContent className='py-4'>
								<div className='relative z-10'>
									<div className='mb-4 dark:border-b-2 border-[#27272d] '>
										<div className='flex justify-between'>
											<h3 className='text-xl font-semibold dark:text-white text-black'>
												{testimonial.name}
                      </h3>
												<svg
													className='h-12 w-12 text-slate-400'
													fill='currentColor'
													viewBox='0 0 32 32'
													aria-hidden='true'
												>
													<path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
												</svg>
											
										</div>
										<p className='text-slate-400/80 text-sm mb-2'>
											{testimonial.title}
										</p>
									</div>
									<blockquote className='text-sm leading-6 dark:text-white text-black'>
										{testimonial.quote}
									</blockquote>
								</div>
								{/* <div className="absolute right-6 w-10 h-10 top-5">
                  <svg
                    className="h-12 w-12 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div> */}
							</CardContent>
						</Card>
					))}
				</div>

				{/* Mobile: Show 4 cards in a 1-column grid */}
				<div className='grid grid-cols-1 md:hidden gap-6'>
				{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className='relative dark:border-2 rounded-xl shadow-sm  border-[#27272d] dark:bg-[#101013] bg-white'
						>
							<CardContent className='py-4'>
								<div className='relative z-10'>
									<div className='mb-4 dark:border-b-2 border-[#27272d] '>
										<div className='flex justify-between'>
											<h3 className='text-xl font-semibold dark:text-white text-black'>
												{testimonial.name}
                      </h3>
												<svg
													className='h-12 w-12 text-slate-400'
													fill='currentColor'
													viewBox='0 0 32 32'
													aria-hidden='true'
												>
													<path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
												</svg>
											
										</div>
										<p className='text-slate-400/80 text-sm mb-2'>
											{testimonial.title}
										</p>
									</div>
									<blockquote className='text-sm leading-6 dark:text-white text-black'>
										{testimonial.quote}
									</blockquote>
								</div>
								{/* <div className="absolute right-6 w-10 h-10 top-5">
                  <svg
                    className="h-12 w-12 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div> */}
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}

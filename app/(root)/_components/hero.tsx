import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function Page() {
	return (
		<>
			<main className='min-h-screen bg-black  md:p-8'>
				<div className=' flex container justify-between  gap-10'>
					{/* Left Section */}
					<div className='flex flex-col justify-center w-3/5 space-y-4'>
						<h1 className='text-4xl  md:text-5xl lg:text-6xl'>
							<span className='bg-gradient-to-r from-[#818CF8] to-[#1D4ED8] bg-clip-text text-transparent'>Ijtimoiy tarmoqlarda</span>{' '}
							<span className='text-white'>{`tez o'sish`}</span>
						</h1>
						<p className='max-w-xl text-base text-slate-400'>
							{` Ijtimoiy tarmoqlarda tez va samarali o'sish uchun bizning yuqori sifatli xizmatlarimizdan foydalaning.
            Ko'proq obunachilar, layklar yoki ko'rishlarni effektivligiga bo'lgan tez va ishonchli tarzda ta'minlaymiz.
            Minimal ta'sir o'tkazadigan bizga ishoning, real auditoriya orqali o'sishni ta'minlang! Barcha ijtimoiy
            tarmoqlar uchun qo'llanilishining qandoy ekanligini ko'zating!`}
						</p>
						<div>
							<Button
								size='lg'
								className='bg-blue-600 text-white hover:bg-blue-700'
							>
								{` Hozirroq ro'yxatdan o'tish`}
							</Button>
						</div>
					</div>

					{/* Right Section - Login Form */}
					<div className='flex items-center w-1/2 justify-center '>
						<Card className='w-full max-w-screen-sm border-0 bg-[#020618] shadow-indigo-50 shadow-[0_5px_30px_rgba(0,0,0,0.25)] '>
							<CardHeader>
								<CardTitle className=' font-normal text-xl text-white'>
									TURBO SMM hisobingiz bilan tizimga kiring
								</CardTitle>
								<p className=' text-sm text-white'>
									Iltimos, TURBOSMM hisobingizdan foydalangan holda tizimga
									kiring. Ijtimoiy tarmoqlardagi akkauntlaringizni
									ishlatmaslikka harakat qiling.
								</p>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='username' className='text-white'>
										Username
									</Label>
									<Input
										id='username'
										className='border-gray-800 bg-black rounded-xl text-white placeholder:text-gray-400'
									/>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<Label htmlFor='password' className='text-white'>
											Parol
										</Label>
									</div>
									<Input
										id='password'
										type='password'
										className='border-gray-800 bg-black rounded-xl text-white placeholder:text-gray-400'
									/>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-2'>
										<Checkbox id='remember' className='border-gray-600' />
										<Label htmlFor='remember' className='text-sm text-gray-300'>
											Meni eslab qol
										</Label>
									</div>
									<Button variant='link' className='px-0 text-sm text-blue-500'>
										Parolni unutdingizmi?
									</Button>
								</div>
								<Button className='w-full bg-blue-600 text-white hover:bg-blue-700'>
									Kirish
								</Button>
								{/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0A0A0A] px-2 text-gray-400">Yoki</span>
                </div>
              </div>
              <Button variant="outline" className="w-full border-gray-800 text-black hover:bg-gray-900 hover:text-white">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                  Sign in with Google
              </Button> */}
							</CardContent>
							<CardFooter className='justify-center'>
								<Button variant='link' className='text-blue-500'>
									{`Hisobingiz yo'qmi? Ro'yxatdan o'tish`}
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</main>
		</>
	)
}

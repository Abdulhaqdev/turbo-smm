import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

export default function HowItWorks() {
  const features = [
    {
      link: '/Signup.svg',
      title: "Akkaunt yarating",
      description: "Ro'yxatdan o'tib hisobingiz orqali platformamizga kirish osonlik bilan amalga oshiring.",
    },
    {
      link: '/coursur.svg',
      title: "Xizmatni tanlang",
      description: "Ehtiyojlaringizga mos ideal xizmatni tanlang tanlovdan foydalanib.",
    },
    {
      link: '/svg.svg',
      title: "Tasdiqiang va yuboring",
      description: "Barcha ma'lumotlarning to'g'ri ekanligini tekshirib, buyurtmangizni joylashtirib.",
    },
    {
      link: '/tegicon.svg',
      title: "Jarayonni kuzatib boring",
      description: "Natijalar ko'rina boshlaganda sizda istalgan paytda boshqaruvni biram dam oling.",
    },
  ]

  return (
    <section className="max-w-screen-xl mx-auto py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-16 flex flex-col items-center text-center">          
          <Image src={'/Light.svg'} width={48} height={48} alt={'Lightbulb'} className='mb-6' />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Turbo SMM Paneli qanday ishlaydi?
          </h2>
          <p className="max-w-2xl text-slate-400">
            {` Biz Instagram, Facebook, Twitter, YouTube va boshqa ijtimoiy tarmoqlar uchun xizmatlar ko'rsatamiz. Bizning
            platformamiz har kimga, hatto siz influencer, brend yoki kichik biznes bo'lsangiz ham mos keladi.`}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-[#101013] ${index !== features.length - 1 ? 'border-r-2 border-[#FFFFFF1A]' : ''}`}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-xl border-2 border-[#101013] p-3">
                  <Image src={feature.link} width={25} height={25}   style={{ width: 'auto', height: 'auto' }}
 alt={feature.title} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

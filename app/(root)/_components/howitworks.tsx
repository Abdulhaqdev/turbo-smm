import { Card, CardContent } from "@/components/ui/card"
import {  LogIn, Settings2, Send, ExternalLink } from "lucide-react"
import Image from 'next/image'

export default function HowItWorks() {
  const features = [
    {
      icon: LogIn,
      title: "Akkaunt yarating",
      description: "Ro'yxatdan o'tib hisobingiz orqali platformamizga kirish osonlik bilan amalga oshiring.",
    },
    {
      icon: Settings2,
      title: "Xizmatni tanlang",
      description: "Ehtiyojlaringizga mos ideal xizmatni tanlang tanlovdan foydalanib.",
    },
    {
      icon: Send,
      title: "Tasdiqiang va yuboring",
      description: "Barcha ma'lumotlarning to'g'ri ekanligini tekshirib, buyurtmangizni joylashtirib.",
    },
    {
      icon: ExternalLink,
      title: "Jarayonni kuzatib boring",
      description: "Natijalar ko'rina boshlaganda sizda istalgan paytda boshqaruvni biram dam oling.",
    },
  ]

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-16 flex flex-col items-center text-center">					
					<Image src={'/Light.svg'} width={48} height={48} alt={'Lightbulb	'} className='mb-6' />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Turbo SMM Paneli qanday ishlaydi?
          </h2>
          <p className="max-w-2xl text-gray-400">
         {`   Biz Instagram, Facebook, Twitter, YouTube va boshqa ijtimoiy tarmoqlar uchun xizmatlar ko'rsatamiz. Bizning
            platformamiz har kimga, hatto siz influencer, brend yoki kichik biznes bo'lsangiz ham mos keladi.`}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-black border-r-2 border-[#FFFFFF1A]"
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full  p-3">
                    <Icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}


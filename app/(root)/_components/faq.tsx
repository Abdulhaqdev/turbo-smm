"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from 'next/image'

const faqs = [
  {
    question: "TURBO SMM qanday xizmatlarni taklif qiladi?",
    answer:
      "TURBO SMM – bu ijtimoiy tarmoqlarda tez va sifatli rivojlanish uchun xizmat ko‘rsatadigan platforma. Biz Instagram, TikTok, YouTube, Telegram va boshqa platformalar uchun obunachilar, like, ko‘rishlar va boshqa faollik xizmatlarini taklif qilamiz.",
  },
  {
    question: "Xizmatlaringiz xavfsizmi?",
    answer:
      "Ha, bizning xizmatlarimiz xavfsiz va foydalanuvchilar hisobiga zarar yetkazmaydi. Biz shaxsiy ma'lumotlarni talab qilmaymiz va faqat organik hamda bot-free xizmatlarni taqdim etamiz.",
  },
  {
    question: "Buyurtma qilingan xizmat qancha vaqtda bajariladi?",
    answer:
      "Buyurtma qilingan xizmat turi va miqdoriga qarab bajarilish vaqti farq qilishi mumkin. Ko‘pgina buyurtmalar 1-5 daqiqa ichida boshlanadi va 1-20 daqiqa ichida tugatiladi.",
  },
  {
    question: "Xizmat narxlari qancha?",
    answer:
      "Xizmatlarimiz narxi turli platformalar va paketlarga qarab farqlanadi. Eng arzon narxlardan foydalanish uchun saytda ro‘yxatdan o‘tib, narxlar bo‘limini tekshirishingiz mumkin.",
  },
  {
    question: "To‘lov qanday amalga oshiriladi?",
    answer:
      "To‘lovlar kartalar, elektron hamyonlar orqali qabul qilinadi. To‘lov tizimlarimiz tez va xavfsiz ishlaydi.",
  },
  {
    question: "SMM xizmatlaridan foydalanish ijtimoiy tarmoqlar qoidalariga zid emasmi?",
    answer:
      "Yo'q, bizning xizmatlarimiz tabiiy ko'rinishda bo'lib, ijtimoiy tarmoqlar algoritmlariga zarar yetkazmaydi. Shunga qaramay, har bir foydalanuvchi xizmatlardan foydalanishdan avval platformalar qoidalari bilan tanishib chiqishi tavsiya etiladi.",
  },
  {
    question: "Agar buyurtma bajarilmasa yoki xatolik yuz bersa, nima qilish kerak?",
    answer:
      "Agar buyurtma bajarilmasa yoki biron muammo yuzaga kelsa, mijozlarga xizmat ko‘rsatish bo‘limiga murojaat qilishingiz mumkin. Biz tezkor yechim topish va pullaringizni qaytarish yoki xizmatni to‘g‘ri yetkazib berish uchun harakat qilamiz.",
  },
  {
    question: "Bir necha marta xizmat sotib olish mumkinmi?",
    answer:
      "Ha, siz bir necha marta turli xizmatlardan foydalana olasiz va hisobingizni tez rivojlantirish imkoniyatiga ega bo‘lasiz.",
  },
  {
    question: "Mijozlar qo‘llab-quvvatlash xizmati qanday ishlaydi?",
    answer:
      "Mijozlar qo‘llab-quvvatlash xizmati 24/7 rejimida ishlaydi. Agar sizga yordam kerak bo‘lsa, Telegram chat yoki email orqali biz bilan bog‘lanishingiz mumkin.",
  },
  {
    question: "TURBO SMM xizmatlari orqali biznesimni rivojlantirishim mumkinmi?",
    answer:
      "Albatta! Bizning xizmatlarimiz brendingizning ommaviyligini oshirish, mahsulot va xizmatlaringizni ko‘proq odamlarga yetkazish uchun ajoyib vositadir. Ko‘p biznes egalari ijtimoiy tarmoqlar orqali auditoriya jalb qilish uchun bizning xizmatlarimizdan foydalanishadi.",
  },
]

export default function FAQSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <Image src={'/Faq.svg'} width={48} height={48} alt='faqicon' />
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            Tez-tez beriladigan savollar
          </h2>
          <p className="mb-12 text-gray-400 md:text-lg">
            {`Sizning fikr-mulohazalaringiz biz uchun muhim! Mana, TURBO SMM mijozlarimizdan ba'zi sharhlar. Yolg'iz shaxslar va kichik hisoblar, shuningdek, bizneslar, tashkilotlar va san'atkorlar ham TURBO SMM ning o'ziga xos dunyosining bir qismidir!`}
          </p>
        </div>

        {/* FAQ section - ikki ustunli */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  mx-auto">
          {faqs.map((faq, index) => (
            <Accordion key={index} type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`} className="border-b-2  border-gray-[#E2E8F0]">
                <AccordionTrigger className="text-left text-sm font-medium text-white hover:no-underline hover:text-gray-300 ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-xs">{faq.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}

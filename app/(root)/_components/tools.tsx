import { Button } from "@/components/ui/button"

export default function ToolsSection() {
  return (
<section className="h-[500px] max-w-screen-xl mx-auto bg-[url('/Background.svg')] bg-cover bg-center flex items-center justify-center">
        <div className="container mx-auto ">
          <div className="mx-auto max-w-3xl text-center">
            <div className="rounded-2xl">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Barcha kerakli instrumentlar ichkarida
              </h2>
              <p className="mb-8 text-lg text-gray-300">
            {`    TURBO SMM paneli barcha biznes tomonlarini bita joyda jamlab. Yangi influenser, tajribali brend yoki
                ijtimoiy tarmoqlarning ma'suliyatlarini o'z qo'lingizdan kichik bo'lsangiz ham, biz sizni qo'llab-
                quvvatlaymiz.`}
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:scale-105"
              >
                {`Bugungi ro'yxatdan o'ting`}
              </Button>
            </div>
          </div>
        </div>
    </section>
  )
}


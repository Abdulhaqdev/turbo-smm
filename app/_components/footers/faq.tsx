"use client"

import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from 'next/image'

// Define the type for FAQ items based on JSON structure
interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const t = useTranslations('faqSection');

  return (
    <section className="max-w-screen-xl mx-auto py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <Image src={'/Faq.svg'} width={48} height={48} alt='faqicon' />
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="mb-12 text-gray-400 md:text-lg">
            {t('description')}
          </p>
        </div>

        {/* FAQ section - ikki ustunli */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
          {t.raw('faqs').map((faq: FAQ, index: number) => (
            <Accordion key={index} type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`} className="border-b-2 border-gray-[#E2E8F0]">
                <AccordionTrigger className="text-left text-sm font-medium dark:text-white text-black hover:no-underline hover:text-gray-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 text-xs">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}
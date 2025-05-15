"use client"

import { useTranslations } from 'next-intl';
import Image from "next/image"

// Define TypeScript interface for translations
interface HeroAboutusTranslations {
  hero: {
    title: {
      part1: string;
      part2: string;
      part3: string;
    };
    description: string;
  };
  marketing: {
    title: string;
    description: string;
  };
}

export default function HeroAboutus() {
  const t = useTranslations('heroAboutus') as (key: keyof HeroAboutusTranslations | string) => string;

  return (
    <main className="min-h-screen container max-w-screen-xl mx-auto">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="px-4 mx-auto">
          <div className="max-w-6xl mx-auto text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-black dark:text-white">{t('hero.title.part1')} </span>
              <span className="text-blue-500">{t('hero.title.part2')} </span>
              <span className="text-black dark:text-white">{t('hero.title.part3')}</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-5xl mx-auto">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Marketing Services Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="lg:max-w-xl text-center lg:text-start mx-auto lg:mx-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
                {t('marketing.title')}
              </h2>
              <p className="text-gray-400 text-base md:text-lg">
                {t('marketing.description')}
              </p>
            </div>

            {/* Image Section */}
            <div className="relative w-full flex md:justify-end lg:max-w-none">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-3xl" />

              {/* Main Image */}
              <div className="relative mx-auto">
                <Image
                  src="/heroImg.svg"
                  alt="Social Media Marketing"
                  width={500}
                  height={520}
                  className="rounded-3xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
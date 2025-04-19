import type { Metadata } from 'next';
import Feature from '@/app/_components/features/feature';
import HowItWorks from '@/app/_components/features/howitworks';
import HeroAboutus from '@/app/_components/heroes/hero-aboutus';
import HeroSupport from '@/app/_components/heroes/hero-support';
import HeroTestimonials from '@/app/_components/heroes/hero-testimonials';

export const metadata: Metadata = {
  title: 'Biz Haqimizda - Turbo SMM',
  description:
    "Turbo SMM - O'zbekistonda ijtimoiy tarmoqlarda tez o'sish uchun ishonchli SMM xizmatlar. Instagram, YouTube, TikTok va Telegram uchun obunachilar, layklar va boshqa xizmatlar.",
  keywords: [
    'Turbo SMM',
    'SMM xizmatlari',
    'ijtimoiy tarmoqlar',
    'obunachilar',
    'layklar',
    'Instagram xizmatlari',
    'YouTube xizmatlari',
    'TikTok xizmatlari',
    'Telegram xizmatlari',
    "O'zbekiston SMM",
  ],
  alternates: {
    canonical: 'https://turbosmm.uz/about',
  },
  openGraph: {
    title: 'Biz Haqimizda - Turbo SMM',
    description:
      "Turbo SMM bilan ijtimoiy tarmoqlarda o'sing! O'zbekistonda Instagram, YouTube, TikTok va Telegram uchun eng yaxshi SMM xizmatlar.",
    url: 'https://turbosmm.uz/about',
    siteName: 'Turbo SMM',
    images: [
      {
        url: 'https://turbosmm.uz/about-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Turbo SMM - Biz Haqimizda',
      },
    ],
    locale: 'uz_UZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biz Haqimizda - Turbo SMM',
    description:
      "O'zbekistonda ijtimoiy tarmoqlarda o'sish uchun Turbo SMM xizmatlari. Obunachilar, layklar va ko'proq!",
    images: ['https://turbosmm.uz/about-twitter-image.jpg'],
    creator: '@TurboSMM',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  return (
    <>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Biz Haqimizda - Turbo SMM',
              description:
                "Turbo SMM - O'zbekistonda ijtimoiy tarmoqlarda tez o'sish uchun ishonchli SMM xizmatlar.",
              url: 'https://turbosmm.uz/about',
              publisher: {
                '@type': 'Organization',
                name: 'Turbo SMM',
                url: 'https://turbosmm.uz',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://turbosmm.uz/logo.png',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Support',
                  email: 'support@turbosmm.uz',
                  availableLanguage: ['Uzbek', 'English'],
                },
              },
            }),
          }}
        />
      </head>
      <HeroAboutus />
      <Feature />
      <HowItWorks />
      <HeroSupport />
      <HeroTestimonials />
    </>
  );
}
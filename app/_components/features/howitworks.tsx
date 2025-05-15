'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useTheme } from 'next-themes' // Import useTheme for theme detection
import { useState, useEffect } from 'react' // Import useEffect for hydration handling
import { useTranslations } from 'next-intl' // Import useTranslations for localization

// Feature interfeysi
interface Feature {
  link: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    link: '/Signup.svg',
    title: 'Create an Account', // Title will be replaced by translation
    description: 'Sign up and access our platform easily through your account.' // Description will be replaced by translation
  },
  {
    link: '/coursur.svg',
    title: 'Choose a Service',
    description: 'Select the ideal service that matches your needs from the available options.'
  },
  {
    link: '/svg.svg',
    title: 'Confirm and Submit',
    description: 'Verify that all details are correct and place your order.'
  },
  {
    link: '/tegicon.svg',
    title: 'Track the Process',
    description: 'Monitor the results as they start to show, and take control at any time while relaxing.'
  },
]

const featureslight: Feature[] = [
  {
    link: 'howitworks/SVG (20).svg',
    title: 'Create an Account',
    description: 'Sign up and access our platform easily through your account.'
  },
  {
    link: 'howitworks/SVG (21).svg',
    title: 'Choose a Service',
    description: 'Select the ideal service that matches your needs from the available options.'
  },
  {
    link: 'howitworks/SVG (23).svg',
    title: 'Confirm and Submit',
    description: 'Verify that all details are correct and place your order.'
  },
  {
    link: 'howitworks/SVG (22).svg',
    title: 'Track the Process',
    description: 'Monitor the results as they start to show, and take control at any time while relaxing.'
  },
]

export default function HowItWorks() {
  const { resolvedTheme } = useTheme() // Use resolvedTheme for guaranteed value
  const [mounted, setMounted] = useState(false) // Track if component is mounted on client
  const t = useTranslations('howItWorks') // HowItWorks matnlarini yuklash
  const translatedFeatures: Feature[] = t.raw('features') // Features matnlarini array sifatida olish

  // Ensure the component is mounted on the client before rendering dynamic styles
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which features to use based on theme
  const currentFeatures: Feature[] = mounted
    ? resolvedTheme === 'dark'
      ? features.map((feature, index) => ({
          ...feature,
          title: translatedFeatures[index].title,
          description: translatedFeatures[index].description,
        }))
      : featureslight.map((feature, index) => ({
          ...feature,
          title: translatedFeatures[index].title,
          description: translatedFeatures[index].description,
        }))
    : featureslight.map((feature, index) => ({
        ...feature,
        title: translatedFeatures[index].title,
        description: translatedFeatures[index].description,
      }))

  return (
    <section className='mx-auto py-16 md:py-24 max-w-screen-xl'>
      <div className='container mx-auto'>
        <div className='mb-16 flex flex-col items-center text-center'>
          <Image
            src={'/Light.svg'}
            width={48}
            height={48}
            alt='Lightbulb'
            className='mb-6 hidden dark:flex'
          />
          <Image
            src={'/Plump.svg'}
            width={48}
            height={48}
            alt='Lightbulb'
            className='mb-6 flex dark:hidden'
          />
          <h2 className='mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl'>
            {t('title')}
          </h2>
          <p className='max-w-2xl text-muted-foreground'>
            {t('description')}
          </p>
        </div>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {currentFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`bg-background dark:bg-[#101013] ${
                // Mobile (default): Bottom border for cards 0, 1, 2
                index < currentFeatures.length - 1
                  ? 'border-b-2 border-[#FFFFFF1A]'
                  : '' // No bottom border for the last card (index 3)
              } ${
                // Tablet (md): Right border for cards 0 and 2 (first and third in 2-column layout)
                (index === 0 || index === 2) && index < currentFeatures.length - 1
                  ? 'md:border-r-2 md:border-b-0'
                  : 'md:border-b-0 md:border-r-0'
              } ${
                // Desktop (lg): Right border for all cards except the last one (index 3)
                index < currentFeatures.length - 1
                  ? 'lg:border-r-2 lg:border-b-0'
                  : 'lg:border-b-0 lg:border-r-0'
              }`}
            >
              <CardContent className='flex flex-col items-center p-6 text-center'>
                <div className='mb-4 rounded-xl border-border p-3'>
                  <Image
                    src={feature.link}
                    width={25}
                    height={25}
                    style={{ width: 'auto', height: 'auto' }}
                    alt={feature.title}
                    className='dark:invert dark:brightness-0' // Optional: Invert for dark mode if needed
                  />
                </div>
                <h3 className='mb-2 text-xl font-bold text-foreground'>
                  {feature.title}
                </h3>
                <p className='text-sm text-muted-foreground'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
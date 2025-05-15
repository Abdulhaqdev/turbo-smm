'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes' // Import useTheme for theme detection
import { useState, useEffect } from 'react' // Import useEffect for hydration handling
import { useTranslations } from 'next-intl' // Import useTranslations for localization

// Logo interfeysi
interface Logo {
  name: string;
  src: string;
}

const paymentLogos: Logo[] = [
  { name: 'Uzumbank', src: '/payments/Uzum.svg' },
  { name: 'Click', src: '/payments/Click.svg' },
  { name: 'Kapital Bank', src: '/payments/Kapitalbank.svg' },
  { name: 'TBC Bank', src: '/payments/Tbc.svg' },
  { name: 'SmartBank', src: '/payments/Smartbank.svg' },
  { name: 'Apelsin', src: '/payments/Apelsin.svg' },
]

const paymentLogos2: Logo[] = [
  { name: 'SQB', src: '/payments/Sqb.svg' },
  { name: 'InfinBank', src: '/payments/Infinback.svg' },
  { name: 'Payme', src: '/payments/Payme.svg' },
  { name: 'Aloqa Bank', src: '/payments/Aloqabank.svg' },
  { name: 'Anor Bank', src: '/payments/Octo.svg' },
  { name: 'MBank', src: '/payments/Mk.svg' },
]

const paymentLogoslight: Logo[] = [
  { name: 'Uzumbank', src: '/paymentslight/uzum.svg' },
  { name: 'Click', src: '/paymentslight/click.svg' },
  { name: 'Kapital Bank', src: '/paymentslight/kapitalbank.svg' },
  { name: 'TBC Bank', src: '/paymentslight/tbc.svg' },
  { name: 'SmartBank', src: '/paymentslight/smartbank.svg' },
  { name: 'Apelsin', src: '/paymentslight/apelsin.svg' },
]

const paymentLogoslight2: Logo[] = [
  { name: 'SQB', src: 'paymentslight/sqb.svg' },
  { name: 'InfinBank', src: '/paymentslight/infinbank.svg' },
  { name: 'Payme', src: '/paymentslight/payme.svg' },
  { name: 'Aloqa Bank', src: '/paymentslight/aloqabank.svg' },
  { name: 'Anor Bank', src: '/paymentslight/accobank.svg' },
  { name: 'MBank', src: '/paymentslight/mkbank.svg' },
]

export default function PaymentMethods() {
  const { resolvedTheme } = useTheme() // Use resolvedTheme for guaranteed value
  const [mounted, setMounted] = useState(false) // Track if component is mounted on client
  const t = useTranslations('paymentMethods') // PaymentMethods matnlarini yuklash

  // Ensure the component is mounted on the client before rendering dynamic styles
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logos to use based on theme
  const currentPaymentLogos: Logo[] = mounted
    ? resolvedTheme === 'dark'
      ? paymentLogos
      : paymentLogoslight
    : paymentLogoslight // Fallback for SSR (use light mode logos)

  const currentPaymentLogos2: Logo[] = mounted
    ? resolvedTheme === 'dark'
      ? paymentLogos2
      : paymentLogoslight2
    : paymentLogoslight2 // Fallback for SSR (use light mode logos)

  return (
    <section className='py-16 md:py-24 max-w-screen-2xl mx-auto'>
      <div className='container mx-auto max-w-screen-2xl md:px-20'>
        <div className='mb-12 flex flex-col items-center text-center'>
          <Image
            src={'/Group.svg'}
            width={48}
            height={48}
            alt='group'
            className='mb-6 flex dark:hidden'
          />
          <Image
            src={'/Icon.svg'}
            width={48}
            height={48}
            alt='group'
            className='mb-6 hidden dark:flex'
          />
          <h2 className='mb-4 text-2xl font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent md:text-4xl'>
            {t('title')}
          </h2>
          <p className='max-w-2xl text-slate-400'>
            {t('description')}
          </p>
        </div>
        {/* Marquee Container for First Set of Logos */}
        <div className='relative w-full overflow-hidden before:absolute before:-left-1 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:dark:from-[#101013] before:from-white before:to-transparent after:absolute after:-right-1 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:dark:from-[#101013] after:from-white after:to-transparent'>
          <div className='horizontal-marquee flex gap-6'>
            {/* First set of logos */}
            {currentPaymentLogos.map((logo, index) => (
              <div
                key={index}
                className='flex h-16 w-32 shrink-0 items-center justify-center'
              >
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={`${logo.name} logo`}
                  width={100}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  className='object-contain'
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {currentPaymentLogos.map((logo, index) => (
              <div
                key={`copy-${index}`}
                className='flex h-16 w-32 shrink-0 items-center justify-center'
              >
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={`${logo.name} logo`}
                  width={100}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  className='object-contain'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Container for Second Set of Logos */}
        <div className='relative w-full overflow-hidden mt-8 before:absolute before:-left-1 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:dark:from-[#101013] before:from-white before:to-transparent after:absolute after:-right-1 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:dark:from-[#101013] after:from-white after:to-transparent'>
          <div className='horizontal-marquee flex gap-6 ml-16'>
            {/* First set of logos */}
            {currentPaymentLogos2.map((logo, index) => (
              <div
                key={index}
                className='flex h-16 w-32 shrink-0 items-center justify-center'
              >
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={`${logo.name} logo`}
                  width={100}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  className='object-contain'
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {currentPaymentLogos2.map((logo, index) => (
              <div
                key={`copy-${index}`}
                className='flex h-16 w-32 shrink-0 items-center justify-center'
              >
                <Image
                  src={logo.src || '/placeholder.svg'}
                  alt={`${logo.name} logo`}
                  width={100}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  className='object-contain'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import { useTranslations } from 'next-intl';
import Image from 'next/image'
import Link from "next/link"

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer id='footer' className="border-gray-800 max-w-screen-xl mx-auto">
      <div className="container mb-14 md:mb-10 md:px-6">
        <div className="mb-12 text-start max-w-3xl">
          <Link className="flex items-center space-x-2" href="/">
            <Image src={'/logo.svg'} alt='logo' width={150} height={20}/>
          </Link>
          <p className="mt-4 dark:text-gray-400 text-black">
            {t('description')}
          </p>
        </div>
        <div className="grid md:text-start grid-cols-2 gap-6 md:gap-12 md:grid-cols-2 lg:grid-cols-4 border-t border-gray-800 pt-8 md:flex-row">
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">
              {t('quickLinks.title')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/">
                  {t('quickLinks.home')}
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  {t('quickLinks.signUp')}
                </Link>
              </li>
              <li>
                <Link href="/services">
                  {t('quickLinks.services')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">
              {t('company.title')}
            </h3>
            <ul className="space-y-4 dark:text-gray-400 text-black">
              <li>
                <Link href="/terms">
                  {t('company.serviceTerms')}
                </Link>
              </li>
              <li>
                <Link href="/about">
                  {t('company.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/support">
                  {t('company.support')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">
              {t('developers.title')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="https://api.turbosmm.uz/api/" target='_blank' >
                  {t('developers.api')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider dark:text-gray-400 text-black">
              {t('pages.title')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="dark:text-gray-400 text-black hover:text-white">
                  {t('pages.home')}
                </Link>
              </li>
              <li>
                <Link href="/service" className="dark:text-gray-400 text-black hover:text-white">
                  {t('pages.service')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="dark:text-gray-400 text-black hover:text-white">
                  {t('pages.aboutUs')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">
            {t('copyright')}
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
              {t('legal.privacyPolicy')}
            </Link>
            <Link href="/updates" className="text-sm text-gray-400 hover:text-white">
              {t('legal.updateList')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
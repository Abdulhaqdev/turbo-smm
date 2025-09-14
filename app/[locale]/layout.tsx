import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/provider/theme-provider';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../i18n/routing';
import TawkToScript from '@/components/TawkToScript'; // 🔹 Tawk.to komponentini import qildik

const noto_sans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: "Turbo SMM | Ijtimoiy tarmoqlarda tez o'sish",
    template: "%s | Turbo SMM",
  },
  description:
    "Ijtimoiy tarmoqlarda tez va samarali o'sish uchun yuqori sifatli SMM xizmatlar. Obunachilar, layklar va boshqa xizmatlarni hozir sinab ko'ring!",
  keywords: [
    'SMM',
    'ijtimoiy tarmoqlar',
    'obunachilar',
    'layklar',
    'marketing',
    'Instagram',
    'YouTube',
    'TikTok',
    'Telegram',
  ],
  icons: {
    icon: '/favicon.png',
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: '3790a3d52bf1ac5e',
  },
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${noto_sans.variable} dark:bg-[#101013] overflow-x-hidden`}
        id="top"
      >
        {/* 🔹 Chatni butun sayt bo‘ylab ishlatish */}
        <TawkToScript />

        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

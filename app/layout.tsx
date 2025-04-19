import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/provider/theme-provider';
import { Toaster } from 'react-hot-toast';

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
  // authors: [{ name: 'Turbo SMM Team', url: 'https://turbosmm.uz' }],
  // creator: 'Turbo SMM',
  // publisher: 'Turbo SMM',
  alternates: {
    canonical: 'https://turbosmm.uz',
  },
  openGraph: {
    title: "Turbo SMM | Ijtimoiy tarmoqlarda tez o'sish",
    description:
      "Ijtimoiy tarmoqlarda o'sish uchun eng yaxshi SMM xizmatlar. Obunachilar, layklar va ko'proq - hozir sinab ko'ring!",
    url: 'https://turbosmm.uz',
    siteName: 'Turbo SMM',
    images: [
      {
        url: 'https://turbosmm.uz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Turbo SMM - Ijtimoiy tarmoqlar xizmatlari',
      },
    ],
    locale: 'uz_UZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Turbo SMM | Ijtimoiy tarmoqlarda tez o'sish",
    description:
      "Tez va samarali SMM xizmatlar bilan ijtimoiy tarmoqlarda o'sing! Obunachilar, layklar va boshqalar.",
    images: ['https://turbosmm.uz/twitter-image.jpg'],
    creator: '@TurboSMM',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-site-verification-code', // Google Search Console kodi
    yandex: '3790a3d52bf1ac5e', // Yandex Webmaster kodi
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Turbo SMM',
              url: 'https://turbosmm.uz',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://turbosmm.uz/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${noto_sans.variable} dark:bg-[#101013] overflow-x-hidden`}
        id="top"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
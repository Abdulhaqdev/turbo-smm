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
  icons: {
		icon: '/favicon.png',
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
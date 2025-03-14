import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
// import "../globals.css";
import Navbar from "./_components/headers/navbar";
import Footer from "./_components/footers/footer";
import { ThemeProvider } from "@/components/provider/theme-provider";

const noto_sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Turbo SMM | Ijtimoiy tarmoqlarda tez o'sish",
  description:
    "Ijtimoiy tarmoqlarda tez va samarali o'sish uchun bizning yuqori sifatli xizmatlarimizdan foydalaning. Ko'proq obunachilar, layklar yoki ko'rishlarni effektivligiga bo'lgan tez va ishonchli tarzda ta'minlaymiz. Minimal ta'sir o'tkazadigan bizga ishoning, real auditoriya orqali o'sishni ta'minlang! Barcha ijtimoiy tarmoqlar uchun qo'llanilishining qandoy ekanligini ko'zating!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
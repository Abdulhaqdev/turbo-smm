import type { Metadata } from "next";
import {   Noto_Sans } from "next/font/google";
import "./globals.css";
import { ChilndProps } from '@/types'
import Navbar from './(root)/_components/navbar'
import Footer from './(root)/_components/footer'



const noto_sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight:["100","200","300","400","500","600"]
});

export const metadata: Metadata = {
  title: "Turbo smm Ijtimoiy tarmoqlarda tez o'sish",
  description: "Ijtimoiy tarmoqlarda tez va samarali o'sish uchun bizning yuqori sifatli xizmatlarimizdan foydalaning. Ko'proq obunachilar, layklar yoki ko'rishlarni effektivligiga bo'lgan tez va ishonchli tarzda ta'minlaymiz. Minimal ta'sir o'tkazadigan bizga ishoning, real auditoriya orqali o'sishni ta'minlang! Barcha ijtimoiy tarmoqlar uchun qo'llanilishining qandoy ekanligini ko'zating!",
};
  
 function RootLayout({children}: ChilndProps) {
  return (
    <html lang="en">
      <body
        className={`bg-[#101013] ${noto_sans.variable} max-w-screen-xl mx-auto overflow-x-hidden`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}

export default RootLayout;
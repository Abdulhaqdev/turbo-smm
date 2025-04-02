import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";

const noto_sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Turbo SMM | Ijtimoiy tarmoqlarda tez o'sish",
  description:
    "Ijtimoiy tarmoqlarda tez va samarali o'sish uchun bizning yuqori sifatli xizmatlarimizdan foydalaning...",
  icons: {
    icon: "/favicon.png", // Fayl joylashuvi
  },
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTheme } from "next-themes"; // Import useTheme for theme detection
import { useState, useEffect } from "react"; // Import useEffect for hydration handling

export default function HowItWorks() {
  const { resolvedTheme } = useTheme(); // Use resolvedTheme for guaranteed value
  const [mounted, setMounted] = useState(false); // Track if component is mounted on client

  // Ensure the component is mounted on the client before rendering dynamic styles
  useEffect(() => {
    setMounted(true);
  }, []);

  

  const features = [
    {
      link: "howitworks/Signup.svg",
      title: "Akkaunt yarating",
      description:
        "Ro'yxatdan o'tib hisobingiz orqali platformamizga kirish osonlik bilan amalga oshiring.",
    },
    {
      link: "howitworks/coursur.svg",
      title: "Xizmatni tanlang",
      description:
        "Ehtiyojlaringizga mos ideal xizmatni tanlang tanlovdan foydalanib.",
    },
    {
      link: "howitworks/svg.svg",
      title: "Tasdiqlang va yuboring",
      description:
        "Barcha ma'lumotlarning to'g'ri ekanligini tekshirib, buyurtmangizni joylashtirib.",
    },
    {
      link: "howitworks/tegicon.svg",
      title: "Jarayonni kuzatib boring",
      description:
        "Natijalar ko'rina boshlaganda sizda istalgan paytda boshqaruvni biram dam oling.",
    },
  ];

  const featureslight = [
    {
      link: "howitworks/SVG (20).svg",
      title: "Akkaunt yarating",
      description:
        "Ro'yxatdan o'tib hisobingiz orqali platformamizga kirish osonlik bilan amalga oshiring.",
    },
    {
      link: "howitworks/SVG (21).svg",
      title: "Xizmatni tanlang",
      description:
        "Ehtiyojlaringizga mos ideal xizmatni tanlang tanlovdan foydalanib.",
    },
    {
      link: "howitworks/SVG (23).svg",
      title: "Tasdiqlang va yuboring",
      description:
        "Barcha ma'lumotlarning to'g'ri ekanligini tekshirib, buyurtmangizni joylashtirib.",
    },
    {
      link: "howitworks/SVG (22).svg",
      title: "Jarayonni kuzatib boring",
      description:
        "Natijalar ko'rina boshlaganda sizda istalgan paytda boshqaruvni biram dam oling.",
    },
  ];
  const currentFeatures = mounted
  ? resolvedTheme === "dark"
    ? features
    : featureslight
  : featureslight; 


  return (
    <section className="mx-auto py-16 md:py-24 max-w-screen-xl">
      <div className="container mx-auto">
        <div className="mb-16 flex flex-col items-center text-center">
          <Image
            src={"/Light.svg"}
            width={48}
            height={48}
            alt="Lightbulb"
            className="mb-6 hidden dark:flex"
          />
          <Image
            src={"/Plump.svg"}
            width={48}
            height={48}
            alt="Lightbulb"
            className="mb-6 flex dark:hidden"
          />
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Turbo SMM Paneli qanday ishlaydi?
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            {` Biz Instagram, Facebook, Twitter, YouTube va boshqa ijtimoiy tarmoqlar uchun xizmatlar ko'rsatamiz. Bizning
            platformamiz har kimga, hatto siz influencer, brend yoki kichik biznes bo'lsangiz ham mos keladi.`}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {currentFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`bg-background dark:bg-[#101013] ${
                // Mobile (default): Bottom border for cards 0, 1, 2
                index < currentFeatures.length - 1
                  ? "border-b-2 border-[#FFFFFF1A]"
                  : "" // No bottom border for the last card (index 3)
              } ${
                // Tablet (md): Right border for cards 0 and 2 (first and third in 2-column layout)
                (index === 0 || index === 2) && index < currentFeatures.length - 1
                  ? "md:border-r-2 md:border-b-0"
                  : "md:border-b-0 md:border-r-0"
              } ${
                // Desktop (lg): Right border for all cards except the last one (index 3)
                index < currentFeatures.length - 1
                  ? "lg:border-r-2 lg:border-b-0"
                  : "lg:border-b-0 lg:border-r-0"
              }`}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-xl border-border p-3">
                  <Image
                    src={feature.link}
                    width={25}
                    height={25}
                    style={{ width: "auto", height: "auto" }}
                    alt={feature.title}
                    className="dark:invert dark:brightness-0" // Optional: Invert for dark mode if needed
                  />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
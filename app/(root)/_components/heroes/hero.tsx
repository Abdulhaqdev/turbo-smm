"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes"; // Ensure next-themes is installed

export default function Page() {
  const { resolvedTheme } = useTheme(); // Use resolvedTheme for guaranteed value
  const [mounted, setMounted] = useState(false); // Track if component is mounted on client

  // Ensure the component is mounted on the client before rendering dynamic styles
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback background for SSR (use a static value or empty to avoid mismatches)
  const defaultBackground = "/lighthero.png"; // Use a default image for SSR

  return (
    <main className="max-w-screen-2xl mx-auto bg-black ">
      <div
        className="inset-0 flex bg-cover bg-center bg-no-repeat py-14"
        style={{
          backgroundImage: mounted
            ? `url('${
                resolvedTheme === "dark" ? "/backgroundhero.png" : "/lighthero.png"
              }')`
            : `url('${defaultBackground}')`, // Fallback for SSR (consistent with server render)
        }}
      >
        <div className="container max-w-screen-xl mx-auto flex flex-col gap-10 lg:flex-row lg:gap-8">
          <div className="flex flex-col justify-center space-y-4 lg:w-1/2 xl:w-3/5">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
              <span className="bg-gradient-to-r from-[#818CF8] to-[#1D4ED8] bg-clip-text text-transparent">
                Ijtimoiy tarmoqlarda
              </span>{" "}
              <span className="text-foreground">{`tez o'sish`}</span>
            </h1>
            <p className="max-w-xl text-sm md:text-base text-muted-foreground">
              {`Ijtimoiy tarmoqlarda tez va samarali o'sish uchun bizning yuqori sifatli xizmatlarimizdan foydalaning.
            Ko'proq obunachilar, layklar yoki ko'rishlarni effektivligiga bo'lgan tez va ishonchli tarzda ta'minlaymiz.
            Minimal ta'sir o'tkazadigan bizga ishoning, real auditoriya orqali o'sishni ta'minlang! Barcha ijtimoiy
            tarmoqlar uchun qo'llanilishining qandoy ekanligini ko'zating!`}
            </p>
            <div>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {`Hozirroq ro'yxatdan o'tish`}
              </Button>
            </div>
          </div>
          {/* Right Section - Login Form */}
          <div className="flex items-center justify-center lg:w-1/2 xl:w-2/5">
            <Card className="w-full rounded-2xl border-0 bg-background  dark:shadow-indigo-50 shadow-[#155DFC] shadow-[0_5px_30px_rgba(0,0,0,0.25)]">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-normal text-foreground">
                  TURBO SMM hisobingiz bilan tizimga kiring
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Iltimos, TURBOSMM hisobingizdan foydalangan holda tizimga kiring. Ijtimoiy tarmoqlardagi
                  akkauntlaringizni ishlatmaslikka harakat qiling.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    Username
                  </Label>
                  <Input
                    id="username"
                    className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">
                      Parol
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-border" />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Meni eslab qol
                    </Label>
                  </div>
                  <Button variant="link" className="h-auto p-0 text-sm text-primary">
                    Parolni unutdingizmi?
                  </Button>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Kirish
                </Button>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="link" className="text-primary">
                  {`Hisobingiz yo'qmi? Ro'yxatdan o'tish`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
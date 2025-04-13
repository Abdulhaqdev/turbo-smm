"use client";

import { useRouter } from "next/navigation";
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
import { useTheme } from "next-themes";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {  useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import login from "@/app/actions/login";
import { toast } from 'react-hot-toast'
import { Service } from '@/lib/types'
import axios from 'axios'

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof schema>;

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { resolvedTheme } = useTheme();
  const method = useForm<LoginFormData>({ resolver: zodResolver(schema) });
  const { replace } = useRouter()
 const [services, setServices] = useState<number>(1);
 
  useEffect(() => {
    const fetchServices = async () => {
    
      try {
        const response = await axios.get<Service[]>(
          `https://api.turbosmm.uz/api/all-services`
       
        );
        console.log(`S uchun services`, response.data);
        const activeServices = response.data.filter((service) => service.is_active);
        setServices(activeServices[0].id);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
    

    fetchServices();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    
    await toast.promise(login(data), {
      loading: "Aniqlanmoqda...",
      success: (res) => res.message,
      error: (error) => error.message,
    });
    replace(`dashboard/new-order?serviceId=${services}`)
  };
  useEffect(()=>setIsMounted(true),[])
  
  if (!isMounted) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );;

  
  return (
    <main className="max-w-screen-2xl mx-auto bg-black">
      <div
        className="inset-0 flex bg-cover bg-center bg-no-repeat py-14"
        style={{
          backgroundImage: `url(${
            resolvedTheme === "dark" ? "/backgroundhero.png" : "/lighthero.png"
          })`,
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
              <Link
                href="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-5 rounded-md"
              >
                {`Hozirroq ro'yxatdan o'tish`}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center lg:w-1/2 xl:w-2/5">
            <Card className="w-full rounded-2xl border-0 bg-background dark:shadow-indigo-50 shadow-[#155DFC] shadow-[0_5px_30px_rgba(0,0,0,0.25)]">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-normal text-foreground">
                  TURBO SMM hisobingiz bilan tizimga kiring
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Iltimos, TURBOSMM hisobingizdan foydalanib tizimga kiring. Ijtimoiy tarmoqlardagi
                  akkauntlaringizni ishlatmaslikka harakat qiling.
                </p>
              </CardHeader>
              <form onSubmit={method.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">
                      Username
                    </Label>
                    <Input
                      id="username"
                      {...method.register("username")}
                      className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                      placeholder="Foydalanuvchi nomi"
                      required
                    />
                    {method.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {method.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      Parol
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...method.register("password")}
                        className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                        placeholder="Parol"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {method.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {method.formState.errors.password.message}
                      </p>
                    )}
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
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={method.formState.isSubmitting}
                  >
                    {method.formState.isSubmitting ? "Kirish..." : "Kirish"}
                  </Button>
                </CardContent>
                <CardFooter className="justify-center">
                  <Link href="/register">
                    <Button variant="link" className="text-primary">
                      {`Hisobingiz yo'qmi? Ro'yxatdan o'tish`}
                    </Button>
                  </Link>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
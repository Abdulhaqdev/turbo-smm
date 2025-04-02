"use client";

import { useState, useEffect } from "react";
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
import Cookies from "js-cookie";
import { ApiResponse, apiService } from "@/lib/apiservise";
import { LoginData, LoginErrors, LoginResponse } from "@/types/login";

export default function Page() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({ username: "", password: "", general: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ username: "", password: "", general: "" });

    const loginData: LoginData = { username, password };
    const response: ApiResponse<LoginResponse> = await apiService.post("/api/token/", loginData);

    if (response.status === 200 && response.data) {
      Cookies.set("accessToken", response.data.access, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      if (rememberMe) {
        Cookies.set("refreshToken", response.data.refresh, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
      }
      // console.log("Login: Token saqlandi:", Cookies.get("accessToken"));
      setIsLoading(false);
      router.push("/dashboard/new-order");
    } else if (response.error) {
      const newErrors: LoginErrors = {};
      if (response.error.username) newErrors.username = response.error.username[0] || "Foydalanuvchi nomida xatolik!";
      if (response.error.password) newErrors.password = response.error.password[0] || "Parolda xatolik!";
      if (!newErrors.username && !newErrors.password) {
        newErrors.general = response.error.detail || "Tizimga kirishda xatolik!";
      }
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                      required
                    />
                    {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                      required
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="border-border"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Kirish..." : "Kirish"}
                  </Button>
                  {errors.general && <p className="text-sm text-destructive text-center">{errors.general}</p>}
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
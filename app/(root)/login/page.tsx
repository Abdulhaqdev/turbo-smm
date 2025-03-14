"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiService } from '@/lib/apiservise'
import { LoginResponse } from '@/types/login'

interface LoginData {
  username: string;
  password: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ username: "", password: "", general: "" });

    const loginData: LoginData = { username, password };
    const response = await apiService.post<LoginResponse, LoginData>("/api/token/", loginData);
    console.log("Login Response:", response);

    if (response.status === 200 && response.data) {
      Cookies.set("accessToken", response.data.access, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("userId", response.data.user_id.toString(), {
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
      console.log("Login: Token saqlandi, user_id:", response.data.user_id);
      setIsLoading(false);
      router.push("/dashboard");
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Tizimga kirish</h1>
          <p className="mt-2 text-muted-foreground">{`Hisobingizga kirish uchun ma'lumotlarni kiriting.`}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Foydalanuvchi nomi</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Foydalanuvchi nomi"
              disabled={isLoading}
            />
            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked: boolean) => setRememberMe(checked)}
              disabled={isLoading}
            />
            <Label htmlFor="rememberMe">Meni eslab qol</Label>
          </div>

          {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Yuklanmoqda..." : "Kirish"}
          </Button>
        </form>

        <div className="text-center text-sm">
        {`  Hisobingiz yo'qmi?`}{" "}
          <a href="/register" className="text-primary hover:underline">
{`            Ro'yxatdan o'tish
`}          </a>
        </div>
      </div>
    </div>
  );
}
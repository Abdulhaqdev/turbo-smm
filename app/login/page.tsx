"use client";

import z from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import login from "../actions/login";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});


export type LoginFormData = z.infer<typeof schema>;

export default function LoginPage() {
  const method = useForm<LoginFormData>({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const { replace } = useRouter()

  const onSubmit = async (data: LoginFormData) => {
    toast.promise(login(data), {
      loading: "Aniqlanmoqda...",
      success: (res) => res.message,
      error: (error) => error.message,
    });
    replace("/")
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Tizimga kirish</h1>
          <p className="mt-2 text-muted-foreground">{`Hisobingizga kirish uchun ma'lumotlarni kiriting.`}</p>
        </div>

        <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Foydalanuvchi nomi</Label>
            <Input
              id="username"
              type="text"
              {...method.register("username")}
              placeholder="Foydalanuvchi nomi"
            />
            {method.formState.errors.username?.message && <p className="text-sm text-destructive">{method.formState.errors.username?.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Parol</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Parol"
                {...method.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {method.formState.errors.password?.message && <p className="text-sm text-destructive">{method.formState.errors.password?.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
            />
            <Label htmlFor="rememberMe">Meni eslab qol</Label>
          </div>

          <Button type="submit" className="w-full" disabled={method.formState.isSubmitting}>
            {method.formState.isSubmitting ? "Yuklanmoqda..." : "Kirish"}
          </Button>
        </form>

        <div className="text-center text-sm">
          {`Hisobingiz yo'qmi?`}{" "}
          <a href="/register" className="text-primary hover:underline">
            {`Ro'yxatdan o'tish`}
          </a>
        </div>
      </div>
    </div>
  )
}

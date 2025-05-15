"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { z } from "zod";
import login from '@/app/actions/login'

// Define TypeScript interface for translations
interface LoginTranslations {
  title: string;
  description: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  rememberMe: string;
  registerLink: string;
  errors: {
    username: string;
    password: string;
  };
  submit: string;
  loading: string;
}

// Create schema dynamically with translated error messages
const createSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(3, t("errors.username")),
    password: z.string().min(6, t("errors.password")),
  });

type LoginFormData = z.infer<ReturnType<typeof createSchema>>;

export default function LoginPage() {
  const t = useTranslations("login") as (key: keyof LoginTranslations | string) => string;

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createSchema(t)),
  });

  const [showPassword, setShowPassword] = useState(false);
  const { replace } = useRouter();
  const [services, setServices] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>(
          `https://api.turbosmm.uz/api/all-services`
        );
        const activeServices = response.data.filter((service) => service.is_active);
        if (activeServices.length > 0) {
          setServices(activeServices[0].id);
        } else {
          console.warn("No active services found");
          toast.error(t("errors.noServices"));
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        toast.error(t("errors.serviceFetchFailed"));
      }
    };

    fetchServices();
  }, [t]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await toast.promise(login(data), {
        loading: t("loading"),
        success: (res) => res.message,
        error: (error) => error.message,
      });
      if (services) {
        replace(`dashboard/new-order?serviceId=${services}`);
      } else {
        replace("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              type="text"
              {...register("username")}
              placeholder={t("usernamePlaceholder")}
            />
            {errors.username?.message && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                {...register("password")}
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
            {errors.password?.message && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="rememberMe" />
            <Label htmlFor="rememberMe">{t("rememberMe")}</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("loading") : t("submit")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/register" className="text-primary hover:underline">
            {t("registerLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
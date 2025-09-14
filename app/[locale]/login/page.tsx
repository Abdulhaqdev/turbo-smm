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
import { googleLogin } from '@/app/actions/google-login'

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
  googleLogin: string;
  googleLoading: string;
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "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";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: object) => void;
          prompt: () => void;
        };
      };
    };
  }
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  // Load Google OAuth script
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
    clientId?: string;
  }

  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    setIsGoogleLoading(true);
    try {
      await toast.promise(googleLogin(response.credential), {
        loading: t("googleLoading") || "Signing in with Google...",
        success: (res) => res.message,
        error: (error) => error.message,
      });

      if (services) {
        replace(`dashboard/new-order?serviceId=${services}`);
      } else {
        replace("/dashboard");
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google Sign-In not loaded');
    }
  };

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

        <div className="space-y-4">
          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isGoogleLoading ? ( "Continue with Google"): ("Google Login")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
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
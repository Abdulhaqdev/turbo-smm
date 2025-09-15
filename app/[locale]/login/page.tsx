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
  googleSignIn: string;
  orContinueWith: string;
}

// Create schema dynamically with translated error messages
const createSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(3, t("errors.username")),
    password: z.string().min(6, t("errors.password")),
  });

type LoginFormData = z.infer<ReturnType<typeof createSchema>>;

// Google Sign-In types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

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

  // Google Client ID from environment
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "577050887686-5g252b918ojrmsfgcl3kaucl5r4ek2o8.apps.googleusercontent.com";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.turbosmm.uz";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>(
          `${API_URL}/api/all-services`
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
  }, [t, API_URL]);

  // Load Google Sign-In script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      const waitForGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(waitForGoogle);
          
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            ux_mode: 'popup'
          });

          const googleButtonElement = document.getElementById('google-signin-button');
          if (googleButtonElement) {
            window.google.accounts.id.renderButton(
              googleButtonElement,
              {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                width: '100%'
              }
            );
          }
        }
      }, 100);

      // Clear interval after 10 seconds if Google doesn't load
      setTimeout(() => clearInterval(waitForGoogle), 10000);
    };

    loadGoogleScript();
  }, [GOOGLE_CLIENT_ID]);

  // Handle Google credential response
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      toast.error("Google authentication failed");
      return;
    }

    setIsGoogleLoading(true);
    
    try {
      // Send Google token to your backend
      const backendResponse = await axios.post(`${API_URL}/api/auth/google/`, {
        token: response.credential
      });

      const { access, refresh, user } = backendResponse.data;

      if (access) {
        // Store tokens (you might want to use a more secure method)
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_data', JSON.stringify(user));

        toast.success("Successfully signed in with Google!");
        
        // Redirect to dashboard
        if (services) {
          replace(`dashboard/new-order?serviceId=${services}`);
        } else {
          replace("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast.error(error.response?.data?.error || "Google sign-in failed");
    } finally {
      setIsGoogleLoading(false);
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

        {/* Google Sign-In Button */}
        <div className="space-y-4">
          <div 
            id="google-signin-button"
            className="w-full flex justify-center"
            style={{ minHeight: '44px' }}
          >
            {/* Google button will be rendered here */}
          </div>
          
          {isGoogleLoading && (
            <div className="text-center text-sm text-muted-foreground">
              Signing in with Google...
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t("orContinueWith") || "Or continue with"}
              </span>
            </div>
          </div>
        </div>

        {/* Regular Login Form */}
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
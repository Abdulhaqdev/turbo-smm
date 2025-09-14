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
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import login from "@/app/actions/login";
import { toast } from 'react-hot-toast';
import { Service } from '@/lib/types';
import axios from 'axios';
import { useTranslations } from 'next-intl';

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof schema>;

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "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";
const GOOGLE_REDIRECT_URI = "https://api.turbosmm.uz/api/auth/google/";

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

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const method = useForm<LoginFormData>({ resolver: zodResolver(schema) });
  const { replace } = useRouter();
  const [services, setServices] = useState<number>(1);
  const t = useTranslations('homepage');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>(
          `https://api.turbosmm.uz/api/all-services`
        );
        const activeServices = response.data.filter((service) => service.is_active);
        setServices(activeServices[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

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

  const handleGoogleResponse = async (response: { credential: string }) => {
    setIsGoogleLoading(true);
    try {
      // Send the Google credential to your backend
      const result = await axios.post(GOOGLE_REDIRECT_URI, {
        credential: response.credential,
      });
console.log(result)
      // Handle successful login
      toast.success('Successfully logged in with Google!');
      replace(`dashboard/new-order?serviceId=${services}`);
    } catch (error) {
      console.error('Google login error:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Google login failed');
      } else {
        toast.error('Google login failed');
      }
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
    await toast.promise(login(data), {
      loading: t('loginLoading'),
      success: (res) => res.message,
      error: (error) => error.message,
    });
    replace(`dashboard/new-order?serviceId=${services}`);
  };

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

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
                {t('title').split(' ').slice(0, 2).join(' ')}
              </span>{" "}
              <span className="text-foreground">
                {t('title').split(' ').slice(2).join(' ')}
              </span>
            </h1>
            <p className="max-w-xl text-sm md:text-base text-muted-foreground">
              {t('description')}
            </p>
            <div>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-5 rounded-md"
              >
                {t('register')}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center lg:w-1/2 xl:w-2/5">
            <Card className="w-full rounded-2xl border-0 bg-background dark:shadow-indigo-50 shadow-[#155DFC] shadow-[0_5px_30px_rgba(0,0,0,0.25)]">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl font-normal text-foreground">
                  {t('loginTitle')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('loginSubtitle')}
                </p>
              </CardHeader>
              
              {/* Google Sign-In Button */}
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-border bg-background text-foreground hover:bg-accent"
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
                  {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              </CardContent>

              <form onSubmit={method.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">
                      {t('usernameLabel')}
                    </Label>
                    <Input
                      id="username"
                      {...method.register("username")}
                      className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                      placeholder={t('usernamePlaceholder')}
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
                      {t('passwordLabel')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...method.register("password")}
                        className="rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
                        placeholder={t('passwordPlaceholder')}
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
                        {t('rememberMe')}
                      </Label>
                    </div>
                    <Button variant="link" className="h-auto p-0 text-sm text-primary">
                      {t('forgotPassword')}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={method.formState.isSubmitting}
                  >
                    {method.formState.isSubmitting ? t('loginLoading') : t('loginButton')}
                  </Button>
                </CardContent>
                <CardFooter className="justify-center">
                  <Link href="/register">
                    <Button variant="link" className="text-primary">
                      {t('noAccount')}
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
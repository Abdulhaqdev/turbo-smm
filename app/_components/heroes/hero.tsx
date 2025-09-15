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
import { useGoogleSignIn } from '@/lib/gogole-auth';
import { googleAuth } from '@/app/actions/google-login';

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof schema>;

type GoogleCredentialResponse = { credential?: string };

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const method = useForm<LoginFormData>({ resolver: zodResolver(schema) });
  const { replace } = useRouter();
  const [services, setServices] = useState<number>(1);
  const t = useTranslations('homepage');
  const { initializeGoogle } = useGoogleSignIn();

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

  // Handle Google credential response using server action
  const handleGoogleCredentialResponse = async (response: GoogleCredentialResponse) => {
    if (!response?.credential) {
      toast.error("Google authentication failed");
      return;
    }

    setIsGoogleLoading(true);
    
    try {
      // Use server action instead of direct API call
      const result = await googleAuth(response.credential);
      
      if (result.success) {
        toast.success(result.message);
        
        // Redirect to dashboard
        replace(`dashboard/new-order?serviceId=${services}`);
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error("Google login failed:", error);
      toast.error("Google sign-in failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    if (isMounted) {
      const setupGoogleSignIn = async () => {
        try {
          await initializeGoogle(handleGoogleCredentialResponse);
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
        }
      };

      setupGoogleSignIn();
    }
  }, [initializeGoogle, isMounted]);

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

              <CardContent className="space-y-4">
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
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regular Login Form */}
                <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-4">
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
                </form>
              </CardContent>

              <CardFooter className="justify-center">
                <Link href="/register">
                  <Button variant="link" className="text-primary">
                    {t('noAccount')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
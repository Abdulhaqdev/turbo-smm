"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/app/hooks/useMobile";
import { AuthLayout } from "../_components/auth-layout";
import { FormData, FormErrors, RegisterResponse } from "@/types/register";
import { ApiResponse, apiService } from '@/lib/apiservise'
// import { ApiResponse, apiService } from "@/lib/apiService";

export default function RegisterPage() {
  const router = useRouter();
  const { isMobile } = useMobile();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    general: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateUsername = (username: string) => /^[a-zA-Z0-9_]{3,}$/.test(username);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => phone.length >= 7 && phone.length <= 15;
  const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors: FormErrors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      general: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ism majburiy maydon";
      valid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Familiya majburiy maydon";
      valid = false;
    }
    if (!validateUsername(formData.username)) {
      newErrors.username = "Foydalanuvchi nomi kamida 3 ta belgi bo'lishi va faqat harf, raqam yoki pastki chiziqdan iborat bo'lishi kerak";
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "To'g'ri elektron pochta manzilini kiriting";
      valid = false;
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Telefon raqami 7 dan 15 tagacha belgi bo'lishi kerak";
      valid = false;
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Parol kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqamdan iborat bo'lishi kerak";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);

      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
      };

      try {
        const response: ApiResponse<RegisterResponse> = await apiService.post("/api/users/", registrationData);

        if (response.status === 201 && response.data) {
          setIsLoading(false);
          router.push("/login");
        } else if (response.error) {
          const apiErrors: FormErrors = {};
          if (response.error.username) apiErrors.username = response.error.username[0];
          if (response.error.email) apiErrors.email = response.error.email[0];
          if (response.error.phone_number) apiErrors.phone = response.error.phone_number[0];
          if (response.error.password) apiErrors.password = response.error.password[0];
          if (response.error.non_field_errors) apiErrors.general = response.error.non_field_errors[0];
          if (response.error.detail) apiErrors.general = response.error.detail;

          setErrors((prev) => ({
            ...prev,
            ...apiErrors,
          }));
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setErrors((prev) => ({
          ...prev,
          general: "Server bilan bog'lanishda xatolik yuz berdi!",
        }));
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Hisob Yaratish"
      description="Ma'lumotlaringizni kiriting va hisobingizni yarating"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-muted-foreground">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ism</Label>
            <div className="relative">
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                required
                className={`pl-10 ${errors.firstName ? "border-destructive" : ""} ${isMobile ? "h-12 text-base" : ""}`}
                disabled={isLoading}
              />
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Familiya</Label>
            <div className="relative">
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                required
                className={`pl-10 ${errors.lastName ? "border-destructive" : ""} ${isMobile ? "h-12 text-base" : ""}`}
                disabled={isLoading}
              />
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Foydalanuvchi nomi</Label>
          <div className="relative">
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => updateFormData("username", e.target.value)}
              required
              className={`pl-10 ${errors.username ? "border-destructive" : ""} ${isMobile ? "h-12 text-base" : ""}`}
              disabled={isLoading}
            />
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Elektron pochta</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              required
              className={`pl-10 ${errors.email ? "border-destructive" : ""} ${isMobile ? "h-12 text-base" : ""}`}
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon raqami</Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="901234567"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                updateFormData("phone", value);
              }}
              required
              className={`pl-10 ${errors.phone ? "border-destructive" : ""} ${isMobile ? "h-12 text-base" : ""}`}
              disabled={isLoading}
            />
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Parol</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              required
              className={`pr-10 ${errors.password ? "border-destructive" : ""} ${isMobile ? "h-12 text-base" : ""}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-1.5 w-1.5 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`} />
              <span className={formData.password.length >= 8 ? "text-green-500" : "text-muted-foreground"}>Kamida 8 ta belgi</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
              <span className={/[A-Z]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>Kamida 1 ta katta harf</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
              <span className={/[a-z]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>Kamida 1 ta kichik harf</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-1.5 w-1.5 rounded-full ${/\d/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`} />
              <span className={/\d/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}>Kamida 1 ta raqam</span>
            </div>
          </div>
        </div>

        <Button type="submit" className={`w-full ${isMobile ? "h-12 text-base" : ""}`} disabled={isLoading}>
          {isLoading ? "Yaratilmoqda..." : "Hisobni yaratish"}
        </Button>
        {errors.general && <p className="text-sm text-destructive text-center">{errors.general}</p>}
      </form>
    </AuthLayout>
  );
}
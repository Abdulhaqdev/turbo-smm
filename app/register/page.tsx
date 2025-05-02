"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMobile } from "@/hooks/useMobile";
import { FormData, FormErrors } from "@/types/register";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

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
  const validatePassword = (password: string) => /.{6,}/.test(password);

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
      newErrors.username = "Foydalanuvchi nomi kamida 3 ta belgi bo'lishi kerak";
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "To'g'ri elektron pochta manzilini kiriting";
      valid = false;
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Telefon raqami 7 dan 15 tagacha bo'lishi kerak";
      valid = false;
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Parol kamida 6 ta belgi bo'lishi kerak";
      valid = false;
    }
  
    setErrors(newErrors);
  
    if (!valid) return;
  
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
      const response = await axios.post('/api/users/', registrationData);
  
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error: unknown) {
      const apiErrors: FormErrors = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        general: "",
      };
  
      const data = axios.isAxiosError(error) ? error.response?.data : null;
  
      if (data) {
        if (data.username) apiErrors.username = data.username[0];
        if (data.email) apiErrors.email = data.email[0];
        if (data.phone_number) apiErrors.phone = data.phone_number[0];
        if (data.password) apiErrors.password = data.password[0];
        if (data.non_field_errors) apiErrors.general = data.non_field_errors[0];
        if (data.detail) apiErrors.general = data.detail;
      } else {
        apiErrors.general = "Server bilan bog'lanishda xatolik yuz berdi!";
      }
  
      setErrors(apiErrors);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Hisob Yaratish</h1>
          <p className="mt-2 text-muted-foreground">
            {`Ma'lumotlaringizni kiriting va hisobingizni yarating`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ism</Label>
            <div className="relative">
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                required
                className={`pl-10 ${errors.firstName ? "border-destructive" : ""} ${
                  isMobile ? "h-12 text-base" : ""
                }`}
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
                className={`pl-10 ${errors.lastName ? "border-destructive" : ""} ${
                  isMobile ? "h-12 text-base" : ""
                }`}
                disabled={isLoading}
              />
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Foydalanuvchi nomi</Label>
            <div className="relative">
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                required
                className={`pl-10 ${errors.username ? "border-destructive" : ""} ${
                  isMobile ? "h-12 text-base" : ""
                }`}
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
                className={`pl-10 ${errors.email ? "border-destructive" : ""} ${
                  isMobile ? "h-12 text-base" : ""
                }`}
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
                className={`pl-10 ${errors.phone ? "border-destructive" : ""} ${
                  isMobile ? "h-12 text-base" : ""
                }`}
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
                className={`pr-10 ${errors.password ? "border-destructive" : ""} ${
                  isMobile ? "h-12 text-base" : ""
                }`}
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
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    formData.password.length >= 6 ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span
                  className={
                    formData.password.length >= 6 ? "text-green-500" : "text-muted-foreground"
                  }
                >
                  Kamida 6 ta belgi
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full ${isMobile ? "h-12 text-base" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Yaratilmoqda..." : "Hisobni yaratish"}
          </Button>
          {errors.general && (
            <p className="text-sm text-destructive text-center">{errors.general}</p>
          )}
        </form>

        <div className="text-center text-sm">
          {`Hisobingiz bormi?`}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {`Kirish`}
          </Link>
        </div>
      </div>
    </div>
  );
}
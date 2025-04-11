"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // yoki 'axios' agar siz global sozlamasangiz
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Header } from "../../_components/header";

interface UserProfile {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  avatar?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // user_id ni localStorage dan olish
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast({
        title: "Error",
        description: "Foydalanuvchi tizimga kirmagan",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [router, toast]);

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserProfile>(`/api/users/${userId}/`);
        const data = response.data;
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phone_number || "");
        setAvatar(data.avatar || "");
      } catch (error: unknown) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.detail
            ? error.response.data.detail
            : "Profil ma'lumotlarini olishda xatolik";
        toast({
          title: "Xatolik",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [userId, toast]);

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !phoneNumber) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlar to‘ldirilishi shart",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Xatolik",
        description: "Yaroqli email kiriting",
        variant: "destructive",
      });
      return;
    }

    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      phone_number: phoneNumber,
    };

    try {
      await axios.put(`/api/users/${userId}/`, updatedProfile);
      toast({
        title: "Muvaffaqiyatli",
        description: "Profil muvaffaqiyatli yangilandi",
        variant: "success",
      });
      router.push("/account");
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.detail
          ? error.response.data.detail
          : "Yangilashda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBackButton />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">Profilni tahrirlash</h1>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{`Shaxsiy ma'lumotlar`}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatar} alt={username} />
                    <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm">
                    Avatarni o‘zgartirish
                  </Button>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ism</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Familiya</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Foydalanuvchi nomi</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefon raqam</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Bekor qilish
                </Button>
                <Button type="submit">Saqlash</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}

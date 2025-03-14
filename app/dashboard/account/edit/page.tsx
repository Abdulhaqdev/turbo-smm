"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "../../_components/ui/use-toast";
import { Header } from "../../_components/header";
import { apiService } from '@/lib/apiservise'
// import { apiService } from "@/services/api-service"; // ApiService fayl yo‘liga moslashtiring

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

  // Login vaqtidan saqlangan ID’ni olish
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log(storedUserId)
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [router, toast]);
  // Foydalanuvchi ma’lumotlarini API’dan olish
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      const response = await apiService.get<UserProfile>(`/api/users/${userId}/`);
      if (response.data) {
        setFirstName(response.data.first_name || "");
        setLastName(response.data.last_name || "");
        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
        setPhoneNumber(response.data.phone_number || "");
        setAvatar(response.data.avatar || "");
      } else {
        toast({
          title: "Error",
          description: response.error?.general?.[0] || "Failed to load profile data",
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

    // Validatsiya
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // API’ga yangilangan ma’lumotlarni yuborish
    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      phone_number: phoneNumber,
    };

    const response = await apiService.put<UserProfile, typeof updatedProfile>(
      `/api/users/${userId}/`,
      updatedProfile
    );

    if (response.data) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        variant: "success",
      });
      router.push("/account");
    } else {
      toast({
        title: "Error",
        description: response.error?.general?.[0] || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBackButton />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatar} alt={username} />
                    <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
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
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
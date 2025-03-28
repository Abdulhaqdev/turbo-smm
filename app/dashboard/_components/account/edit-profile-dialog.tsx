"use client";

import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "../ui/use-toast";
import { apiService } from "@/lib/apiservise";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Yangi holat qo‘shildi

  useEffect(() => {
    const userId = Cookies.get("userId");
    const accessToken = Cookies.get("accessToken");
    if (!accessToken || !userId) {
      console.log("No access token or userId, redirecting to /login");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      const response = await apiService.get<UserProfile>(`/api/users/${userId}/`);
      if (response.status === 200 && response.data) {
        // setUserProfile(response.data);
        setFirstName(response.data.first_name || "");
        setLastName(response.data.last_name || "");
        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
        setPhoneNumber(response.data.phone_number || ""); // phone_number yuklanadi
      } else {
        console.log("Failed to fetch user profile, redirecting to /login");
        router.push("/login");
      }
    };

    if (open) fetchData();
  }, [open, router]);

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "All fields are required, including phone number",
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

    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Oddiy telefon raqam tekshiruvi
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number (e.g., +998901234567)",
        variant: "destructive",
      });
      return;
    }

    const userId = Cookies.get("userId");
    const accessToken = Cookies.get("accessToken");
    if (!userId || !accessToken) {
      toast({
        title: "Error",
        description: "User ID or access token not found. Please log in again.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      phone_number: phoneNumber, // Yangi maydon qo‘shildi
    };

    try {
      const response = await apiService.put<UserProfile, typeof updatedProfile>(
        `/api/users/${userId}/`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 200 && response.data) {
        // setUserProfile(response.data);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
          variant: "success",
        });
        onOpenChange(false);
      } else {
        throw new Error(response.error?.general?.[0] || "Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information below and save your changes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarFallback className="text-lg">
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid w-full gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
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
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+998901234567"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
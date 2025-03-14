"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Qo‘shimcha accessibility uchun
} from "@/components/ui/dialog"; // Barcha dialog komponentlari bir joydan
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/components/ui/use-toast"; // To‘g‘ri yo‘l
import { apiService } from "@/lib/apiservise";
import Cookies from "js-cookie";
import { useToast } from '../ui/use-toast'

// UserProfile interfeysi
interface UserProfile {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number?: string;
  avatar?: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile;
}

export function EditProfileDialog({ open, onOpenChange, userProfile }: EditProfileDialogProps) {
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Dialog ochilganda formani qayta yuklash
  useEffect(() => {
    if (open && userProfile) {
      setFirstName(userProfile.first_name || "");
      setLastName(userProfile.last_name || "");
      setUsername(userProfile.username || "");
      setEmail(userProfile.email || "");
    }
  }, [open, userProfile]);

  // Handle form submission
  const handleSubmit = async () => {
    // Simple validation
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // API orqali profilni yangilash
    const userId = Cookies.get("userId");
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
    };

    try {
      const response = await apiService.put<UserProfile, typeof updatedProfile>(
        `/api/users/${userId}/`,
        updatedProfile
      );

      if (response.status === 200 && response.data) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
          variant: "success",
        });
        onOpenChange(false); // Dialogni yopish
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
            <AvatarImage src={userProfile?.avatar} alt={userProfile?.username} />
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
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAccountContent } from "./user-account-content";
import { UserProfile } from '@/lib/types'

import { apiService } from '@/lib/apiservise'
// import { apiService } from "@/lib/apiService";
// import { UserProfile } from "@/types/user";

interface UserAccountNavProps {
  mobile?: boolean;
}

export function UserAccountNav({ mobile = false }: UserAccountNavProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<Pick<UserProfile, "username" | "first_name" | "last_name" | "avatar"> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"main" | "orders" | "transactions" | "support">("main");

  // Fetch user profile on mount
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
        setUserProfile({
          username: response.data.username,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          avatar: response.data.avatar,
        });
      } else {
        console.log("Failed to fetch user profile, redirecting to /login");
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  // Get user initials for avatar fallback
  const getInitials = () => {
    return userProfile ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}` : "";
  };

  // Handle back navigation
  const handleBack = () => {
    if (view !== "main") {
      setView("main");
    } else {
      setIsOpen(false);
    }
  };

  // Get title based on current view
  const getTitle = () => {
    switch (view) {
      case "orders":
        return "Buyurtmalar tarixi";
      case "transactions":
        return "So'nggi tranzaksiyalar";
      case "support":
        return "Yordam xizmati";
      default:
        return "Mening hisobim";
    }
  };

  // Navigate to account page
  const goToAccountPage = () => {
    router.push("/dashboard/account");
    setIsOpen(false);
  };

  if (!userProfile) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <>
      {mobile ? (
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={goToAccountPage}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{userProfile.username}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md p-0">
            <div className="flex h-16 items-center border-b px-6">
              {view !== "main" && (
                <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Orqaga</span>
                </Button>
              )}
              <h2 className="text-lg font-semibold">{getTitle()}</h2>
            </div>

            <UserAccountContent
              view={view}
              setView={setView}
              onClose={() => setIsOpen(false)}
              goToAccountPage={goToAccountPage}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
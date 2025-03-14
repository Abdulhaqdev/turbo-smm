"use client";

import { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
// import { ThemeToggle } from "./theme-toggle";
import { UserAccountNav } from "./account/user-account-nav";
// import { apiService } from "@/lib/apiService";
import { formatCurrency, convertToUZS } from "@/lib/utils";
import { apiService } from '@/lib/apiservise'
import ModeToggle from '@/components/shared/ModeToggle'
import { UserProfile } from '@/lib/types'
// import { UserProfile } from "@/types/user";

interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter();
  // const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<Pick<UserProfile, "username" | "balance"> | null>(null);

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
          balance: response.data.balance,
        });
      } else {
        console.log("Failed to fetch user profile, redirecting to /login");
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Orqaga">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-muted/50 px-3 py-1.5 text-xs sm:text-sm">
            Xush kelibsiz: {userProfile?.username }
          </div>
          <div className="rounded-full bg-muted/50 px-3 py-1.5 text-xs sm:text-sm">
            Balans: {userProfile ? formatCurrency(convertToUZS(userProfile.balance)): ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Qidirish" className="w-[200px] pl-8 md:w-[300px]" />
        </div>
        <ModeToggle />
        <UserAccountNav mobile />
      </div>
    </header>
  );
}
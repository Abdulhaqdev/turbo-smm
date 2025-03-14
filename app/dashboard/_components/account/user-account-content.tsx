"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut, Settings, ShoppingBag, CreditCard, HelpCircle, Edit, ChevronRight, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency, convertToUZS } from "@/lib/utils";
import { EditProfileDialog } from "./edit-profile-dialog"; // To‘g‘ri yo‘lga ishora qiling
import { SupportView } from "./support-view";
import { TransactionsView } from "./transactions-view";
import { OrdersView } from "./orders-view";
import { Separator } from "../ui/separator";
import { apiService } from "@/lib/apiservise";
import { UserProfile } from "@/lib/types";

interface UserAccountContentProps {
  view: "main" | "orders" | "transactions" | "support";
  setView: (view: "main" | "orders" | "transactions" | "support") => void;
  onClose?: () => void;
}

export function UserAccountContent({ view, setView, onClose }: UserAccountContentProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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
        setUserProfile(response.data);
      } else {
        console.log("Failed to fetch user profile, redirecting to /login");
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userId");
    console.log("Logout: Tokenlar o'chirildi");
    router.push("/login");
    if (onClose) onClose();
  };

  const getInitials = () => {
    return userProfile ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}` : "";
  };

  if (view === "main") {
    if (!userProfile) {
      return <div>Yuklanmoqda...</div>;
    }

    return (
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {userProfile.first_name} {userProfile.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">@{userProfile.username}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditProfileOpen(true)}
              aria-label="Profilni tahrirlash"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{userProfile.email}</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hisob balansi</span>
              <span className="text-lg font-bold">{formatCurrency(convertToUZS(userProfile.balance))}</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex-1 p-6">
          <h3 className="text-lg font-medium mb-4">Hisob</h3>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setView("orders")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Buyurtmalar tarixi
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setView("transactions")}>
              <CreditCard className="mr-2 h-4 w-4" />
              {`So'nggi tranzaksiyalar`}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setView("support")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Yordam xizmati
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Hisob sozlamalari
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </nav>
        <div className="p-6 mt-auto">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Chiqish
          </Button>
        </div>
        </div>


        {/* EditProfileDialog ga userProfile uzatiladi */}
        <EditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          userProfile={userProfile}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {/* {view === "orders" && <OrdersView />} */}
      {/* {view === "transactions" && <TransactionsView />} */}
      {/* {view === "support" && <SupportView />} */}
    </div>
  );
}
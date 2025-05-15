"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/shared/ModeToggle";
// import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { IUser } from "@/types/session";
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';


export function Header() {
  const router = useRouter();
  const { session } = useSession();
  const [userProfile, setUserProfile] = useState<IUser | undefined | null>(null);

  useEffect(() => {
    setUserProfile(session?.user);
  }, [session]);

  const getInitials = () => {
    return userProfile
      ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
      : "";
  };

  const goToAccountPage = () => {
    router.push("/dashboard/account");
  };

  // const handleBack = () => {
  //   router.back();
  // };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
       
        <div className="flex h-16 lg:hidden items-center border-b ">
          <Link className="flex items-center space-x-2" href="//dashboard/new-order">
            {/* Light theme logo */}
            <Image
              src="/turbosmm.png"
              alt="Light theme logo"
              width={200}
              height={30}
              priority // Preload the image
              className="dark:hidden object-contain"
            />
            {/* Dark theme logo */}
            <Image
src="/logodark.png"
              alt="Dark theme logo"
              width={200}
              height={30}
              priority // Preload the image
              className="hidden dark:block object-contain"
            />
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-muted/50 px-3 py-1.5 text-xs sm:text-sm">
            Balans: {userProfile?.balance ? userProfile.balance : "0 UZS"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={goToAccountPage}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
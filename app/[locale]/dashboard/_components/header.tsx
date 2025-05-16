"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/shared/ModeToggle";
// import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";
import { IUser } from "@/types/session";
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { VscAccount } from "react-icons/vsc";

export function Header() {
  const router = useRouter();
  const { session } = useSession();
  const [userProfile, setUserProfile] = useState<IUser | undefined | null>(null);

  useEffect(() => {
    setUserProfile(session?.user);
  }, [session]);



  const goToAccountPage = () => {
    router.push("/dashboard/account");
  };

  // const handleBack = () => {
  //   router.back();
  // };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
       
        <div className="flex h-16 lg:hidden items-center  justify-start border-b ">
          <Link className="flex items-center" href="//dashboard/new-order">
            {/* Light theme logo */}
            <Image
              src="/turbosmm.png"
              alt="Light theme logo"
              width={110}
              height={20}
              priority // Preload the image
              className="dark:hidden object-contain"
            />
            {/* Dark theme logo */}
            <Image
src="/logodark.png"
              alt="Dark theme logo"
              width={110}
              height={20}
              priority // Preload the image
              className="hidden dark:block object-contain"
            />
          </Link>
        </div>
       
      </div>

      <div className="flex items-center gap-0">
      <div className="flex flex-wrap items-center text-xs">
            UZS {userProfile?.balance ? userProfile.balance : "0"}
       </div>
        <LanguageSwitcher />
        <ModeToggle />
        <Button
          variant="ghost"
          // size="icon"
          className="h-10 w-10 p-0 rounded-full"
          onClick={goToAccountPage}
        >
            <VscAccount className="h-9 w-9" /> 
        </Button>
      </div>
    </header>
  );
}
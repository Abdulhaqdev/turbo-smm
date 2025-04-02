"use client";

import { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { formatCurrency, convertToUZS } from "@/lib/utils";
import { apiService } from '@/lib/apiservise'
import ModeToggle from '@/components/shared/ModeToggle'
import { UserProfile } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter();
  // const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<Pick<UserProfile, "username" | "balance"| "first_name"| "last_name"> | null>(null);

  useEffect(() => {
    const userId = Cookies.get("user_id");
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
          balance: response.data.balance,
					last_name: response.data.last_name,

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
		return userProfile
			? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`
			: ''
	}

	const goToAccountPage = () => {
		router.push('/dashboard/account')
	}
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
           <div className="flex  h-16  md:hidden items-center border-b">
        <Link className="dark:flex hidden items-center space-x-2" href="/">
          <Image src="/logo.svg" alt="logo" width={150} height={20} />
        </Link>
        <Link className="dark:hidden flex items-center space-x-2" href="/">
          <Image src="/turbosmm.svg" alt="logo" width={150} height={20} />
        </Link>
      </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-muted/50 px-3 py-1.5 text-xs sm:text-sm">
            Balans: {userProfile ? formatCurrency(convertToUZS(userProfile.balance)): ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
       
        <ModeToggle />
        <Button
					variant='ghost'
					size='icon'
					className='h-9 w-9 rounded-full'
					onClick={goToAccountPage}
				>
					<Avatar className='h-9 w-9'>
						<AvatarFallback>{getInitials()}</AvatarFallback>
					</Avatar>
				</Button>
        {/* <div className='hidden md:flex'>
        <UserAccountNav mobile />
        </div>
        <div className='flex md:hidden'>
        <UserAccountNav  />
        </div> */}
      </div>
    </header>
  );
}
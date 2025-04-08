"use client";

import { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
// import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
// import { apiService } from '@/lib/apiservise'
import ModeToggle from '@/components/shared/ModeToggle'
// import { UserProfile } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from '@/hooks/useSession'
import { IUser } from '@/types/session'

interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: HeaderProps) {
  const router = useRouter();
  // const pathname = usePathname();
    const {session} = useSession()
    console.log(session)
    const [userProfile, setUserProfile] = useState<IUser | undefined | null>( );
    useEffect(()=> {
      setUserProfile(session?.user)   

    },[session])
 
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
            Balans: {userProfile ? (userProfile.balance): ""}
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
    
      </div>
    </header>
  );
}
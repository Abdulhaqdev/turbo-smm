"use server"

import { LoginData } from '@/types/login'
import { cookies } from 'next/headers'

export default async function login(data:LoginData){
  const baseUrl:string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL ;

	const cookiStore = await cookies()
	const res = await fetch(`${baseUrl}/api/token/`, {
		method:"POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body:JSON.stringify(data),
	})
	 const resData = await res.json()
	 cookiStore.set("refresh_token", resData.refresh, {httpOnly:true, secure:true,sameSite:"strict"})

}
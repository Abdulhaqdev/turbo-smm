'use server'

import { IUser } from '@/types/session'
import { cookies } from 'next/headers'

export default async function getSession() {
  const baseUrl:string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL ;

	const cookiStore = await cookies()
	const token = cookiStore.get('refreshToken')?.value
	if (token) {
		const res = await fetch(`${baseUrl}/api/token/refresh/`, {
			method: 'POST',
			body: JSON.stringify({ refresh: token }),
			headers: { 'Content-Type': 'application/json' },
		})
		const resData = await res.json()

		const userRes = await fetch(
			`${baseUrl}/api/me/`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${resData.access}`,
				},
			}
		)
		const userData: IUser = await userRes.json()
		const access: string = resData.access
		return { access_token: access, user: userData }
	}
}

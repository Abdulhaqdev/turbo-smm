'use server'

import { cookies } from 'next/headers'
import axios from "@/lib/axios";

export default async function getSession() {
	const cookieStore = await cookies()
	const token = cookieStore.get('refresh_token')?.value
	try {
		if (token) {
			const tokenRes = await axios.post("/api/token/refresh/", { refresh: token })
			const userRes = await axios.get("/api/me/", { headers: { Authorization: `Bearer ${tokenRes.data.access}` } })
			return { token: tokenRes.data.access, user: userRes.data }
		}
		return { token: null, user: null }
	} catch {
		cookieStore.delete("refresh_token");
		return { token: null, user: null }
	}
}

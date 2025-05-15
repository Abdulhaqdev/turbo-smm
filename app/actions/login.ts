'use server'

import axios from '@/lib/axios'
import { cookies } from 'next/headers'
import { LoginFormData } from '../_components/heroes/hero'

export default async function login(data: LoginFormData) {
	try {
		const cookiStore = await cookies()
		const loginRes = axios.post('/api/token/', data)
		cookiStore.set('refresh_token', (await loginRes).data.refresh, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
		})
		return { message: 'Login successful' }
	} catch (error) {
		// console.log(first)
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data.detail)
		}
		throw new Error('Something went wrong ')
	}
}

import { UserSession } from '@/types/session'
import { create } from 'zustand'

import axios from '@/lib/axios'
import { Category, Service } from '@/lib/types'

interface SessionStore {
	session: UserSession | null
	setSession: (session: UserSession | null) => void
}
export const useSession = create<SessionStore>(set => ({
	session: null,
	setSession: session => set({ session }),
}))

interface StoreState {
	categories: Category[]
	services: Service[]
	isLoading: boolean
	error: string | null
	fetchData: (token: string) => Promise<void>
	setCategories: (categories: Category[]) => void
	setServices: (services: Service[]) => void
	clearError: () => void
}

export const useStore = create<StoreState>(set => ({
	categories: [],
	services: [],
	isLoading: false,
	error: null,
	fetchData: async (token: string) => {
		set({ isLoading: true, error: null })
		try {
			const [categoryRes, serviceRes] = await Promise.all([
				axios.get('/api/categories/', {
					headers: { Authorization: `Bearer ${token}` },
				}),
				axios.get('/api/services/', {
					headers: { Authorization: `Bearer ${token}` },
				}),
			])
			const categories = categoryRes.data as Category[]
			const services = serviceRes.data as Service[]
			set({
				categories: categories.filter(cat => cat.is_active !== false),
				services: services.filter(srv => srv.is_active),
				isLoading: false,
			})
		} catch (err) {
			console.error(err)
			set({
				error: "Ma'lumotlarni yuklashda xatolik yuz berdi.",
				isLoading: false,
			})
		}
	},
	setCategories: categories => set({ categories }),
	setServices: services => set({ services }),
	clearError: () => set({ error: null }),
}))

import { ISession } from '@/types/session'
import { create } from 'zustand'

interface SessionState {
			session: ISession | null
	setSession: (session: ISession | null | undefined) => void
}

export const useSession = create<SessionState>(set => ({
	session: {
		accessToken: null,
		user: null,
	},
	setSession: session => set({ session }),
}))

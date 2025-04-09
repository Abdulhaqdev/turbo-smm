import { UserSession } from '@/types/session';
import { create } from 'zustand'

interface SessionStore {
	session: UserSession | null;
	setSession: (session: UserSession | null) => void;
}
export const useSession = create<SessionStore>(set => ({
	session: null,
	setSession: session => set({ session }),
}))

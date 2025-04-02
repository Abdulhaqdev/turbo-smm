// lib/store.ts
import { create } from 'zustand';
import { apiService } from '@/lib/apiservise';
import Cookies from 'js-cookie';
import { UserProfile } from '@/lib/types';

interface UserState {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userProfile: null,
  loading: false,
  error: null,

  fetchUserProfile: async () => {
    const userId = Cookies.get("user_id");
    const accessToken = Cookies.get("accessToken");

    if (!accessToken || !userId) {
      set({ error: "No access token or userId" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await apiService.get<UserProfile>(`/api/users/${userId}/`);
      if (response.status === 200 && response.data) {
        set({ userProfile: response.data, loading: false });
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Something went wrong",
        loading: false,
      });
    }
  },

  setUserProfile: (profile: UserProfile) => set({ userProfile: profile }),

  clearUserProfile: () => set({ userProfile: null, error: null, loading: false }),
}));
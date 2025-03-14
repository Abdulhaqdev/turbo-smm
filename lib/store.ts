// lib/store.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import { ApiResponse, apiService } from './apiservise'
// import { apiService, ApiResponse } from "@/lib/apiService";

interface UserState {
  userProfile: {
    id: number | null;
    userId: number | null; // Login dan olingan user_id
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    balance: number | string;
    phoneNumber: string;
    apiKey: string;
    avatar?: string;
  };
  setUserProfile: (profile: Partial<UserState["userProfile"]>) => void;
  fetchUserProfile: (userId: number) => Promise<void>;
  clearUserProfile: () => void;
}

export const useStore = create<UserState>((set) => ({
  userProfile: {
    id: null,
    userId: null,
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    balance: 0,
    phoneNumber: "",
    apiKey: "",
    avatar: "",
  },
  setUserProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),
  fetchUserProfile: async (userId: number) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.log("No access token found");
      return;
    }
console.log(userId)
    try {
      const response: ApiResponse<any> = await apiService.get(`/api/users/2/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200 && response.data) {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            id: response.data.id,
            userId,
            username: response.data.username,
            firstName: response.data.first_name,
            lastName: response.data.last_name,
            email: response.data.email,
            balance: response.data.balance,
            phoneNumber: response.data.phone_number,
            apiKey: response.data.api_key,
            avatar: response.data.avatar || "", // Agar backendda avatar bo'lsa
          },
        }));
      } else {
        console.error("Failed to fetch user profile:", response.error);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
  clearUserProfile: () => set({
    userProfile: {
      id: null,
      userId: null,
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      balance: 0,
      phoneNumber: "",
      apiKey: "",
      avatar: "",
    },
  }),
}));
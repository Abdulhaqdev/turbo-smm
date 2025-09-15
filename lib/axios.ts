import axios from "axios";
import { useSession } from "@/hooks/useSession";
import { useLocale } from "@/hooks/useLocale";

// Default base URL - production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.turbosmm.uz";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Accept-Language interceptor
axios.interceptors.request.use(
  (config) => {
    // Safely get locale
    try {
      const locale = useLocale?.getState?.()?.locale || "uz-UZ";
      config.headers["Accept-Language"] = locale;
    } catch (error) {
      console.log(error)
      console.warn("Could not get locale, using default");
      config.headers["Accept-Language"] = "uz-UZ";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config?.method?.toUpperCase()}] ${response.config?.url}:`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle unauthorized errors
    if (error.response?.status === 401) {
      try {
        useSession?.setState?.({ session: null });
      } catch (sessionError) {
        console.warn("Could not clear session:", sessionError);
      }
      
      // Redirect to login if we're on client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;
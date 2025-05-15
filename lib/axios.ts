import axios from "axios";
import { BASE_URL } from "./constants";
import { useSession } from "@/hooks/useSession";
import { useLocale } from "@/hooks/useLocale";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Accept"] = "application/json";

// Accept-Language interceptor
axios.interceptors.request.use(
  (config) => {
    const locale = useLocale.getState().locale || "uz-UZ";
    config.headers["Accept-Language"] = locale;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSession.setState({ session: null });
    }
    return Promise.reject(error);
  }
);

export default axios;
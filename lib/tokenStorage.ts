// lib/tokenStorage.ts
export const tokenStorage = {
  setAccessToken: (token: string) => localStorage.setItem("accessToken", token),
  getAccessToken: () => localStorage.getItem("accessToken"),
  removeAccessToken: () => localStorage.removeItem("accessToken"),

  setRefreshToken: (token: string) => localStorage.setItem("refreshToken", token),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  removeRefreshToken: () => localStorage.removeItem("refreshToken"),

  clearAll: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_id");
  },
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    const { exp } = JSON.parse(atob(payload));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const logout = () => {
  tokenStorage.clearAll();
  window.location.href = "/login";
};

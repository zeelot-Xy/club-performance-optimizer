const ACCESS_TOKEN_KEY = "club-performance-access-token";

const safeWindow = () => (typeof window === "undefined" ? null : window);

export const storage = {
  getAccessToken() {
    return safeWindow()?.localStorage.getItem(ACCESS_TOKEN_KEY) ?? null;
  },

  setAccessToken(token: string) {
    safeWindow()?.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken() {
    safeWindow()?.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

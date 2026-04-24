import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../lib/api-client";
import { storage } from "../lib/storage";
import type { ApiAuthUser, ApiLoginResponse } from "../types/ui";

type AuthContextValue = {
  token: string | null;
  user: ApiAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => storage.getAccessToken());
  const [user, setUser] = useState<ApiAuthUser | null>(null);

  const meQuery = useQuery({
    queryKey: ["auth", "me", token],
    enabled: Boolean(token),
    retry: false,
    queryFn: () => apiClient.get<ApiAuthUser>("/auth/me"),
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data]);

  useEffect(() => {
    if (meQuery.isError) {
      storage.clearAccessToken();
      setToken(null);
      setUser(null);
      queryClient.removeQueries();
    }
  }, [meQuery.isError, queryClient]);

  const login = async (email: string, password: string) => {
    const result = await apiClient.post<ApiLoginResponse>("/auth/login", { email, password });

    storage.setAccessToken(result.accessToken);
    setToken(result.accessToken);
    setUser(result.user);
    queryClient.setQueryData(["auth", "me", result.accessToken], result.user);
  };

  const logout = () => {
    storage.clearAccessToken();
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading: Boolean(token) && meQuery.isPending,
      login,
      logout,
    }),
    [token, user, meQuery.isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider.");
  }

  return context;
};

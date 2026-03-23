'use client';

import { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import apiClient from '../../../../lib/api-client';
import {
  AUTH_EVENT_STORAGE_KEY,
  LOGIN_ROUTE,
  PLATFORM_HOME_ROUTE,
  SESSION_EVENT,
  clearAuthToken,
  getAuthToken,
  isPublicRoute,
  setAuthToken,
} from '../../../../lib/session';

type User = {
  id: string;
  vat: string;
  mobile: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
  invalidateAllCaches: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_QUERY_KEY = ['auth', 'session'] as const;

const fetchCurrentUser = async (): Promise<User | null> => {
  if (!getAuthToken()) {
    return null;
  }

  const { data } = await apiClient.get('/users/me');
  return data;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const resetSession = (
    type: (typeof SESSION_EVENT)[keyof typeof SESSION_EVENT] = SESSION_EVENT.loggedOut
  ) => {
    clearAuthToken(type);
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.removeQueries();
  };

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const token = response.data?.token;
      if (!token) {
        throw new Error('Missing auth token in login response');
      }

      setAuthToken(token);
      const currentUser = await fetchCurrentUser();
      return currentUser;
    },
    onSuccess: (currentUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, currentUser);
      router.replace(PLATFORM_HOME_ROUTE);
    },
    onError: () => {
      clearAuthToken(SESSION_EVENT.loggedOut);
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  const invalidateAllCaches = () => {
    queryClient.invalidateQueries();
  };

  const logoutMutation = useMutation({
    mutationFn: async (type: (typeof SESSION_EVENT)[keyof typeof SESSION_EVENT]) => {
      resetSession(type);
    },
    onSuccess: () => {
      router.replace(LOGIN_ROUTE);
    },
  });

  const handleLogin = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  useEffect(() => {
    const handleSessionEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ type?: string }>;
      const type = customEvent.detail?.type;

      if (type === SESSION_EVENT.loggedIn) {
        refetch();
        return;
      }

      if (type === SESSION_EVENT.loggedOut || type === SESSION_EVENT.expired) {
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        router.replace(LOGIN_ROUTE);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_EVENT_STORAGE_KEY || !event.newValue) {
        return;
      }

      const payload = JSON.parse(event.newValue) as { type?: string };

      if (payload.type === SESSION_EVENT.loggedIn) {
        refetch();
        return;
      }

      if (
        payload.type === SESSION_EVENT.loggedOut ||
        payload.type === SESSION_EVENT.expired
      ) {
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        router.replace(LOGIN_ROUTE);
      }
    };

    window.addEventListener('commenergy:session', handleSessionEvent as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(
        'commenergy:session',
        handleSessionEvent as EventListener
      );
      window.removeEventListener('storage', handleStorage);
    };
  }, [queryClient, refetch, router]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && !isPublicRoute(pathname)) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (user && isPublicRoute(pathname)) {
      router.replace(PLATFORM_HOME_ROUTE);
    }
  }, [isLoading, pathname, router, user]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        handleLogin,
        handleLogout: () => logoutMutation.mutate(SESSION_EVENT.loggedOut),
        invalidateAllCaches,
        isAuthenticated: !!user,
        isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

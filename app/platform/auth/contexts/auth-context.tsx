'use client';

import { createContext, useContext, useEffect } from 'react';
import apiClient from '../../../../lib/api-client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

const fetchUser = async (): Promise<User | null> => {
  const token = Cookies.get('auth-token');
  if (!token) return null;
  try {
    const { data } = await apiClient.get('/users/me');
    return data;
  } catch (error) {
    Cookies.remove('auth-token');
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on failure to avoid multiple requests
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

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
      console.log('RESPONSE', response);
      Cookies.set('auth-token', response.data.token);
      return response.data;
    },
    onSuccess: () => {
      console.log('Login successful, invalidating queries and redirecting');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/platform');
    },
    onError: (error) => {
      console.log('### Login mutation error:', error);
    },
  });

  const invalidateAllCaches = () => {
    queryClient.invalidateQueries();
    queryClient.clear();
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      Cookies.remove('auth-token');
      invalidateAllCaches();
      router.replace('/platform/auth/login');
    },
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handleUnauthorized = (event: StorageEvent) => {
      if (event.key === 'auth-token' && !event.newValue) {
        logoutMutation.mutate();
      }
    };

    window.addEventListener('storage', handleUnauthorized);
    return () => window.removeEventListener('storage', handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        handleLogin,
        handleLogout: () => logoutMutation.mutate(),
        invalidateAllCaches,
        isAuthenticated: !!user,
        isLoading,
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

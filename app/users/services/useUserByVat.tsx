import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '../model/user';

const fetchUserByVat = async (vat: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/vat/${vat}`);
  return data;
};

export function useUserByVat(vat: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['user', 'vat', vat],
    queryFn: () => fetchUserByVat(vat),
    enabled: enabled && !!vat?.trim(),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: false, // Don't retry on error (user not found)
  });
}

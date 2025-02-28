import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '../model/user';

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users');
  return data;
};

export function useUsers() {
  const { data, ...rest } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });

  return {
    data: data ?? [],
    ...rest,
  };
}

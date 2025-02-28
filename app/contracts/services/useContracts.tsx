import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Contract } from '../model/contract';

const fetchContracts = async (): Promise<Contract[]> => {
  const { data } = await apiClient.get('/contracts');
  return data;
};

export function useContracts() {
  const { data, ...rest } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });

  return {
    data: data ?? [],
    ...rest,
  };
}

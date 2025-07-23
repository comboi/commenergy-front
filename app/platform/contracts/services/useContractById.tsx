import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Contract } from '../model/contract';

const fetchContractById = async (contractId: string): Promise<Contract> => {
  const { data } = await apiClient.get(`/contracts/${contractId}`);
  return data;
};

export function useContractById(contractId: string) {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => fetchContractById(contractId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
    enabled: !!contractId,
  });
}

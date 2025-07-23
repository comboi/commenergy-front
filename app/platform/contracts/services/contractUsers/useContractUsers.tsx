import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { components } from '@/lib/api-schema';

export type ContractUserEnriched =
  components['schemas']['ContractUserEnriched'];

const fetchContractUsers = async (
  contractId: string
): Promise<ContractUserEnriched[]> => {
  const { data } = await apiClient.get(
    `/contract-users/contract/${contractId}`
  );
  return data;
};

export function useContractUsers(contractId: string) {
  return useQuery({
    queryKey: ['contractUsers', contractId],
    queryFn: () => fetchContractUsers(contractId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
    enabled: !!contractId,
  });
}

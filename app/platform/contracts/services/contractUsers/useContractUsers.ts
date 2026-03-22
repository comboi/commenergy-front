import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { components } from '@/lib/api-schema';

export type ContractUserEnriched =
  components['schemas']['ContractUserEnriched'];
type ContractUser = ContractUserEnriched;

export function useContractUsers(contractId: string) {
  return useQuery({
    queryKey: ['contract-users', 'contract', contractId],
    queryFn: async (): Promise<ContractUser[]> => {
      const { data } = await apiClient.get(
        `/contract-users/contract/${contractId}`,
      );
      return data;
    },
    enabled: !!contractId,
  });
}

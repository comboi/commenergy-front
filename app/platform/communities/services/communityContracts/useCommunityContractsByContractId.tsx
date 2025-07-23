import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { components } from '@/lib/api-schema';

export type CommunityContractEnriched =
  components['schemas']['CommunityContractEnriched'];

const fetchCommunityContractsByContractId = async (
  contractId: string
): Promise<CommunityContractEnriched[]> => {
  const { data } = await apiClient.get(
    `/contracts/${contractId}/community-contracts`
  );
  return data;
};

export function useCommunityContractsByContractId(contractId: string) {
  return useQuery({
    queryKey: ['communityContractsByContractId', contractId],
    queryFn: () => fetchCommunityContractsByContractId(contractId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
    enabled: !!contractId,
  });
}

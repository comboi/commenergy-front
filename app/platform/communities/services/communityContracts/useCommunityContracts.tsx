import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

import { CommunityContract } from '../../model/communityContract';

const fetchCommunityContracts = async (
  communityId: string
): Promise<CommunityContract[]> => {
  const { data } = await apiClient.get(
    `/community-contracts/community/${communityId}`
  );
  return data;
};

export function useCommunityContracts(
  communityId: string,
  options?: UseQueryOptions
) {
  return useQuery(
    {
      queryKey: ['communityContracts', communityId],
      queryFn: () => fetchCommunityContracts(communityId),
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    }
    // { skip: !communityId }
  );
}

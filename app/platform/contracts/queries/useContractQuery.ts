import { useQuery } from '@tanstack/react-query';

import { contractQueryKeys, fetchContractById } from '../api/contracts';

export function useContractQuery(contractId: string) {
  return useQuery({
    queryKey: contractQueryKeys.detail(contractId),
    queryFn: () => fetchContractById(contractId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!contractId,
  });
}

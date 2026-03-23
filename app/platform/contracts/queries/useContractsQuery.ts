import { useQuery } from '@tanstack/react-query';

import { fetchContracts, contractQueryKeys } from '../api/contracts';
import { ContractUserRole } from '../types/contract';

export function useContractsQuery({
  ownerType,
}: {
  ownerType?: ContractUserRole | null;
}) {
  const { data, ...rest } = useQuery({
    queryKey: contractQueryKeys.list(ownerType),
    queryFn: () => fetchContracts(ownerType ?? undefined),
    staleTime: 1000 * 60,
    retry: 2,
  });

  return {
    data: data ?? [],
    ...rest,
  };
}

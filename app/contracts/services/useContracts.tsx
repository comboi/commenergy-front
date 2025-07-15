import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Contract, ContractUserRole } from '../model/contract';

const fetchContracts = async (
  ownerType?: ContractUserRole
): Promise<Contract[]> => {
  const { data } = await apiClient.get('/contracts', {
    params: {
      ownerType,
    },
  });
  return data;
};

export function useContracts({
  ownerType,
}: {
  ownerType?: ContractUserRole | null;
}) {
  const { data, ...rest } = useQuery({
    queryKey: ['contracts', ownerType],
    queryFn: () => fetchContracts(ownerType ?? undefined),
    staleTime: 1000 * 60 * 1, // Consider data fresh for 5 minutes
    retry: 2,
  });

  return {
    data: data ?? [],
    ...rest,
  };
}

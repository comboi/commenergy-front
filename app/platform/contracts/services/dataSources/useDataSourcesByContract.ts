import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { components } from '@/lib/api-schema';

type DataSource = components['schemas']['DataSourceResponseDto'];

export function useDataSourcesByContract(contractId: string) {
  return useQuery({
    queryKey: ['data-sources', 'contract', contractId],
    queryFn: async (): Promise<DataSource[]> => {
      const { data } = await apiClient.get(
        `/data-sources/contract/${contractId}`
      );
      return data;
    },
    enabled: !!contractId,
  });
}

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export type DataSourceType = 'DATA_DIS' | 'SHELLY_CLOUD';

export function useDataSourceTypes() {
  return useQuery({
    queryKey: ['data-source-types'],
    queryFn: async (): Promise<DataSourceType[]> => {
      const { data } = await apiClient.get('/data-sources/types');
      return data;
    },
  });
}

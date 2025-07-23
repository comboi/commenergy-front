import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface IDataSourceConfig {
  type: string;
  name: string;
  description: string;
  requiredFields: Record<string, ConfigField>;
}

export interface ConfigField {
  type: 'string' | 'number' | 'boolean' | 'url';
  description: string;
  example: string;
  required: boolean;
}

export function useDataSourceConfiguration(type: 'DATA_DIS' | 'SHELLY_CLOUD') {
  return useQuery({
    queryKey: ['dataSourceConfiguration', type],
    queryFn: async (): Promise<IDataSourceConfig> => {
      const response = await apiClient.get(
        `/data-sources/configurations/${type}`
      );
      return response.data as IDataSourceConfig;
    },
    enabled: !!type,
  });
}

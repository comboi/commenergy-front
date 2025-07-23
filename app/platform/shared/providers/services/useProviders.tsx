import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { EnergyProvider } from '../../models/energy-providers';

const fetchEnergyProviders = async (): Promise<EnergyProvider[]> => {
  const { data } = await apiClient.get('/energy-providers');
  return data;
};

export function useProviders() {
  const { data, ...rest } = useQuery({
    queryKey: ['providers'],
    queryFn: fetchEnergyProviders,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });

  return {
    data: data ?? [],
    ...rest,
  };
}

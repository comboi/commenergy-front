import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import {
  Community,
  mapCommunitySchemaToCommunity,
} from '../../model/community';

export const communityQueryKeys = {
  all: ['communities'] as const,
  detail: (id: string) => ['communities', 'detail', id] as const,
};

const fetchCommunities = async (): Promise<Community[]> => {
  const { data } = await apiClient.get('/communities');
  return data.map(mapCommunitySchemaToCommunity);
};

const fetchCommunityById = async (id: string): Promise<Community> => {
  const { data } = await apiClient.get(`/communities/${id}`);
  return mapCommunitySchemaToCommunity(data);
};

export function useCommunities() {
  return useQuery({
    queryKey: communityQueryKeys.all,
    queryFn: fetchCommunities,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useCommunityById(id: string) {
  return useQuery({
    queryKey: communityQueryKeys.detail(id),
    queryFn: () => fetchCommunityById(id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!id,
  });
}

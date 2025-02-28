import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Community, mapCommunitySchemaToCommunity } from '../model/community';

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
    queryKey: ['communities'],
    queryFn: fetchCommunities,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });
}

export function useCommunityById(id: string) {
  console.log('useCommunityById', id);
  return useQuery({
    queryKey: ['community', id],
    queryFn: () => fetchCommunityById(id),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });
}

import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

import {
  BulkUpdateCommunityUsersDto,
  CommunityUser,
} from '../../model/communityUser';

const getCommunityUser = async (
  communityId: string
): Promise<CommunityUser[]> => {
  const { data } = await apiClient.get(`/communities/${communityId}/users`);
  return data;
};

export function useUserCommunities(communityId: string) {
  return useQuery<CommunityUser[], Error>({
    queryKey: ['communityUsers', communityId],
    queryFn: () => getCommunityUser(communityId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
    enabled: Boolean(communityId),
  });
}

const updateCommunityUsers = async (
  communityId: string,
  payload: BulkUpdateCommunityUsersDto
): Promise<CommunityUser[]> => {
  const { data } = await apiClient.put(
    `/communities/${communityId}/users`,
    payload
  );
  return data;
};

export function useUpdateUsersToCommunities(communityId: string) {
  return useMutation<CommunityUser[], Error, BulkUpdateCommunityUsersDto>({
    mutationKey: ['communityUsers', communityId],
    mutationFn: (users: BulkUpdateCommunityUsersDto) =>
      updateCommunityUsers(communityId, users),
    onError: (error) => {
      console.error('Error updating Community:', error);
    },
  });
}

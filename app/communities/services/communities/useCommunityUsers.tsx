import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

import {
  CommunityUser,
  CreateNewUserCommunityDto,
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

const updateCommunityUser = async (
  communityId: string,
  userId: string,
  user: Partial<Omit<CommunityUser, 'communityId' | 'userId'>>
): Promise<CommunityUser> => {
  const { data } = await apiClient.put(
    `/communities/${communityId}/users/${userId}`,
    user
  );
  return data;
};

export function useUpdateCommunityUser(communityId: string) {
  return useMutation<
    CommunityUser,
    Error,
    {
      userId: string;
      user: Partial<Omit<CommunityUser, 'communityId' | 'userId'>>;
    }
  >({
    mutationKey: ['updateCommunityUser', communityId],
    mutationFn: ({ userId, user }) =>
      updateCommunityUser(communityId, userId, user),
    onError: (error) => {
      console.error('Error updating community user:', error);
    },
  });
}

const createCommunityUser = async (
  communityId: string,
  user: CreateNewUserCommunityDto
): Promise<CommunityUser> => {
  const { data } = await apiClient.post(
    `/communities/${communityId}/users`,
    user
  );
  return data;
};

export function useCreateCommunityUser(communityId: string) {
  return useMutation<CommunityUser, Error, CreateNewUserCommunityDto>({
    mutationKey: ['createCommunityUser', communityId],
    mutationFn: (user: CreateNewUserCommunityDto) =>
      createCommunityUser(communityId, user),
    onError: (error) => {
      console.error('Error creating community user:', error);
    },
  });
}

const deleteCommunityUser = async (
  communityId: string,
  userId: string
): Promise<void> => {
  await apiClient.delete(`/communities/${communityId}/users/${userId}`);
};

export function useDeleteCommunityUser(communityId: string) {
  return useMutation<void, Error, string>({
    mutationKey: ['deleteCommunityUser', communityId],
    mutationFn: (userId: string) => deleteCommunityUser(communityId, userId),
    onError: (error) => {
      console.error('Error deleting community user:', error);
    },
  });
}

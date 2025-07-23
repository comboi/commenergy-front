import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import {
  CreateSharingVersionDto,
  SharingVersion,
  UpdateSharingVersionDto,
} from '../model/sharingVersion';

const fetchSharingVersions = async (
  communityId: string
): Promise<SharingVersion[]> => {
  const { data } = await apiClient.get(`/sharing-versions/${communityId}`);
  return data;
};

export function useSharingVersions(communityId: string) {
  return useQuery({
    queryKey: ['sharingVersions', communityId],
    queryFn: () => fetchSharingVersions(communityId),
    staleTime: 1000 * 60 * 1, // Consider data fresh for 1 minute
    retry: 2,
  });
}

type Props = {
  callback?: (id: string) => void;
};

export const updateSharingVersion = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (
      data: UpdateSharingVersionDto & { versionId: string }
    ) => {
      const { versionId, ...sharingVersion } = data;
      const response = await apiClient.patch(
        `/sharing-versions/${data.versionId}`,
        sharingVersion
      );
      return response.data;
    },
    onSuccess: (data) => {
      callback?.(data?.id);
    },
  });
};

export const useCreateSharingVersion = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (data: CreateSharingVersionDto) => {
      const response = await apiClient.post(`/sharing-versions`, data);
      return response.data;
    },
    onSuccess: (data) => {
      callback?.(data?.id);
    },
  });
};

export const useSetProductionSharingVersions = ({
  callback,
}: {
  callback: () => void;
}) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(
        `/sharing-versions/${id}/set-production`
      );
      return response.data;
    },
    onSuccess: (data) => {
      callback?.();
    },
  });
};

export const useDeleteSharingVersion = ({
  callback,
}: {
  callback: () => void;
}) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/sharing-versions/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      callback?.();
    },
  });
};

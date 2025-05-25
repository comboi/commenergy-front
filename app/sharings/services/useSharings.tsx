import { useMutation } from '@tanstack/react-query';

import apiClient from '@/lib/api-client';
import { NewSharingDto } from '../model/sharing';

type Props = {
  callback?: () => void;
};

export const useUpdateSharing = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (data: NewSharingDto) => {
      const response = await apiClient.patch(`/sharings/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      callback?.();
    },
  });
};

export const useCreateSharing = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (data: NewSharingDto) => {
      const response = await apiClient.post(`/sharings`, data);
      return response.data;
    },
    onSuccess: () => {
      callback?.();
    },
  });
};

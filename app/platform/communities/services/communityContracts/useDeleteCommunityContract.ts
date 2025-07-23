import { useMutation } from '@tanstack/react-query';

import apiClient from '@/lib/api-client';

type Props = {
  callback?: () => void;
};

export const useDeleteCommunityContract = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (data: {
      communityId: string;
      communityContractId: string;
    }) => {
      const response = await apiClient.delete(
        `/community-contracts/community/${data.communityId}/contract/${data.communityContractId}`
      );
      return response.data;
    },
    onSuccess: () => {
      callback?.();
    },
  });
};

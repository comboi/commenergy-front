import { useMutation } from '@tanstack/react-query';

import { CommunityContractDto } from '@/lib/api-schema';
import apiClient from '@/lib/api-client';

type Props = {
  callback?: () => void;
};

export const useCreateCommunityContract = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (data: CommunityContractDto) => {
      const response = await apiClient.post(
        `/community-contracts/community/${data.communityId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      callback?.();
    },
  });
};

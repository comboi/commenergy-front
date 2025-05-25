import { useMutation } from '@tanstack/react-query';

import { CommunityContractDto } from '@/lib/api-schema';
import apiClient from '@/lib/api-client';

type Props = {
  callback?: () => void;
};

export const useUpdateCommunityContract = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (
      data: CommunityContractDto & { communityContractId: string }
    ) => {
      const response = await apiClient.put(
        `/community-contracts/community/${data.communityId}/contract/${data.communityContractId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      callback?.();
    },
  });
};

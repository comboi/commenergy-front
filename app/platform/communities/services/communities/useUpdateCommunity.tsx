import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Community, NewCommunityDto } from '../../model/community';
import apiClient from '../../../../../lib/api-client';
import { communityQueryKeys } from './useCommunities';

const updateCommunity = async (
  updatedCommunity: NewCommunityDto
): Promise<Community> => {
  const { data } = await apiClient.patch(
    `/communities/${updatedCommunity.id}`,
    updatedCommunity
  );
  return data;
};

type Props = {
  callback?: () => void;
};

export function useUpdateCommunity({ callback }: Props) {
  const queryClient = useQueryClient();

  return useMutation<Community, Error, NewCommunityDto>({
    mutationKey: communityQueryKeys.all,
    mutationFn: updateCommunity,
    onSuccess: () => {
      toast.success('Community updated successfully');
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
      callback?.();
    },
    onError: (error) => {
      console.error('Error updating community:', error);
      toast.error('Error updating community');
    },
  });
}

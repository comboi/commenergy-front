import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Community, NewCommunityDto } from '../../model/community';
import apiClient from '../../../../../lib/api-client';
import { communityQueryKeys } from './useCommunities';

const postCommunity = async (
  newCommunity: NewCommunityDto
): Promise<Community> => {
  const { data } = await apiClient.post('/communities', newCommunity);
  return data;
};

type Props = {
  callback?: () => void;
};

export function useCreateCommunity({ callback }: Props) {
  const queryClient = useQueryClient();

  return useMutation<Community, Error, NewCommunityDto>({
    mutationKey: communityQueryKeys.all,
    mutationFn: postCommunity,
    onSuccess: () => {
      toast.success('Community created successfully');
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
      callback?.();
    },
    onError: (error) => {
      console.error('Error creating community:', error);
      toast.error('Error creating community');
    },
  });
}

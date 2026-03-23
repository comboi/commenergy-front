import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

import { communityQueryKeys } from './useCommunities';

const deleteCommunity = async (communityId: string): Promise<void> => {
  await apiClient.delete(`/communities/${communityId}`);
};

type Props = {
  callback?: () => void;
};

export function useDeleteCommunity({ callback }: Props) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: communityQueryKeys.all,
    mutationFn: deleteCommunity,
    onSuccess: () => {
      toast.success('Community deleted successfully');
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
      callback?.();
    },
    onError: (error) => {
      console.error('Error deleting community:', error);
      toast.error('Error deleting community');
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

const deleteCommunity = async (communityId: string): Promise<void> => {
  await apiClient.delete(`/communities/${communityId}`);
};

type Props = {
  callback?: () => void;
};

export function useDeleteCommunity({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation({
    mutationKey: ['Communities'],
    mutationFn: (communityId: string) => deleteCommunity(communityId),
    onError: (error) => {
      console.error('Error deleting Community:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Community deleted successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error deleting Community');
    }
  }, [error, isSuccess, isError]);

  return {
    data: data ?? [],
    error,
    ...rest,
  };
}

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Community, NewCommunityDto } from '../../model/community';
import apiClient from '../../../../../lib/api-client';

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
  const { data, error, isSuccess, isError, ...rest } = useMutation({
    mutationKey: ['communities'],
    mutationFn: (updatedCommunity: NewCommunityDto) =>
      updateCommunity(updatedCommunity),
    onError: (error) => {
      console.error('Error updating Community:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Community updated successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error updating Community');
    }
  }, [error, isSuccess, isError]);

  return {
    data: data ?? [],
    error,
    ...rest,
  };
}

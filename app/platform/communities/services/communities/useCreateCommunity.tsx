import { useMutation } from '@tanstack/react-query';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Community, NewCommunityDto } from '../../model/community';
import apiClient from '../../../../../lib/api-client';

const postCommunity = async (
  newCommunity: NewCommunityDto
): Promise<Community> => {
  console.log(newCommunity);
  const { data } = await apiClient.post('/communities', newCommunity);
  return data;
};

type Props = {
  callback?: () => void;
};

export function useCreateCommunity({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation({
    mutationKey: ['communities'],
    mutationFn: (newCommunity: NewCommunityDto) => postCommunity(newCommunity),
    onError: (error) => {
      console.error('Error creating Community:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.error('Community created successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error creating Community');
    }
  }, [error, isSuccess, isError]);

  return {
    data: data ?? [],
    error,
    ...rest,
  };
}

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

const deleteDataSource = async (id: string): Promise<void> => {
  await apiClient.delete(`/data-sources/${id}`);
};

type Props = {
  callback?: () => void;
};

export function useDeleteDataSource({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation({
    mutationKey: ['data-sources'],
    mutationFn: (id: string) => deleteDataSource(id),
    onError: (error) => {
      console.error('Error deleting data source:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Data source deleted successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error deleting data source');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    ...rest,
  };
}

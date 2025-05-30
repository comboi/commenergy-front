import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

const deleteContract = async (contractId: string): Promise<void> => {
  await apiClient.delete(`/contracts/${contractId}`);
};

type Props = {
  callback?: () => void;
};

export function useDeleteContract({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation({
    mutationKey: ['Contracts'],
    mutationFn: (contractId: string) => deleteContract(contractId),
    onError: (error) => {
      console.error('Error deleting Contract:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Contract deleted successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error deleting Contract');
    }
  }, [error, isSuccess, isError]);

  return {
    data: data ?? [],
    error,
    ...rest,
  };
}

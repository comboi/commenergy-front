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
    mutationKey: ['contracts'],
    mutationFn: (contractId: string) => deleteContract(contractId),
    onError: (error) => {
      console.error('Error deleting contract:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Contract deleted successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error deleting contract');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    ...rest,
  };
}

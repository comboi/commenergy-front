import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const deleteContract = async (contractId: string): Promise<void> => {
  await apiClient.delete(`/contracts/${contractId}`);
};

type Props = {
  callback?: () => void;
};

export function useDeleteContract({ callback }: Props) {
  const { data, error, isError, isSuccess, ...rest } = useMutation({
    mutationKey: ['contracts'],
    mutationFn: (contractId: string) => deleteContract(contractId),
    onError: (error) => {
      console.error('Error deleting contract:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.error('Contract deleted successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error deleting contract');
    }
  }, [error, isSuccess, isError]);

  return {
    data,
    error,
    ...rest,
  };
}

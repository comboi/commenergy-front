import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useEffect } from 'react';
import { toast } from 'sonner';

const updateContract = async (
  contractId: string,
  contractData: any
): Promise<void> => {
  await apiClient.patch(`/contracts/${contractId}`, contractData);
};

type Props = {
  callback?: () => void;
};

export function useUpdateContract({ callback }: Props) {
  const { data, error, isError, isSuccess, ...rest } = useMutation({
    mutationKey: ['contracts'],
    mutationFn: ({
      contractId,
      contractData,
    }: {
      contractId: string;
      contractData: any;
    }) => updateContract(contractId, contractData),
    onError: (error) => {
      console.error('Error updating contract:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.error('Contract created successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error creating contract');
    }
  }, [error, isSuccess, isError]);

  return {
    data,
    error,
    ...rest,
  };
}

import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Contract } from '../model/contract';

const updateContract = async (
  contractId: string,
  contractData: any
): Promise<Contract> => {
  const { data } = await apiClient.patch(
    `/contracts/${contractId}`,
    contractData
  );
  return data;
};

type Props = {
  callback?: (id: string) => void;
};

export function useUpdateContract({ callback }: Props) {
  const { data, error, isError, isSuccess, ...rest } = useMutation<
    Contract,
    Error,
    { contractId: string; contractData: any }
  >({
    mutationKey: ['contracts'],
    mutationFn: ({ contractId, contractData }) =>
      updateContract(contractId, contractData),
    onError: (error) => {
      console.error('Error updating contract:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.error('Contract created successfully');
      callback?.(data.id);
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

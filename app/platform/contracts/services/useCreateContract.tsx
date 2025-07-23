import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Contract, NewContractDto } from '../model/contract';
import { useEffect } from 'react';
import { toast } from 'sonner';

const postContract = async (newContract: NewContractDto): Promise<Contract> => {
  console.log(newContract);
  const { data } = await apiClient.post('/contracts', newContract);
  return data;
};

type Props = {
  callback?: (contractId: string) => void;
};

export function useCreateContracts({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation<
    Contract,
    Error,
    NewContractDto
  >({
    mutationKey: ['contracts'],
    mutationFn: (newContract: NewContractDto) => postContract(newContract),
    onError: (error) => {
      console.error('Error creating contract:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Contract created successfully');
      callback?.(data.id);
    } else if (isError) {
      toast.error('Error creating contract');
    }
  }, [error, isSuccess, isError]);

  return {
    data: data ?? [],
    error,
    ...rest,
  };
}

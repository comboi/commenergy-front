import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Contract, NewContractDto } from '../model/contract';

const postContract = async (newContract: NewContractDto): Promise<Contract> => {
  console.log(newContract);
  const { data } = await apiClient.post('/contracts', newContract);
  return data;
};

export function useCreateContracts() {
  const { data, error, ...rest } = useMutation({
    mutationKey: ['contracts'],
    mutationFn: (newContract: NewContractDto) => postContract(newContract),
    onError: (error) => {
      console.error('Error creating contract:', error);
    },
  });

  return {
    data: data ?? [],
    error,
    ...rest,
  };
}

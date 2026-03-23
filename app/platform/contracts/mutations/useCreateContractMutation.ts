import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { contractQueryKeys, createContract } from '../api/contracts';
import { Contract, NewContractDto } from '../types/contract';

type Props = {
  callback?: (contractId: string) => void;
};

export function useCreateContractMutation({ callback }: Props) {
  const queryClient = useQueryClient();

  return useMutation<Contract, Error, NewContractDto>({
    mutationKey: contractQueryKeys.all,
    mutationFn: createContract,
    onSuccess: (contract) => {
      toast.success('Contract created successfully');
      queryClient.invalidateQueries({ queryKey: contractQueryKeys.all });
      callback?.(contract.id);
    },
    onError: (error) => {
      console.error('Error creating contract:', error);
      toast.error('Error creating contract');
    },
  });
}

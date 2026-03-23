import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { contractQueryKeys, updateContract } from '../api/contracts';
import { Contract, UpdateContractDto } from '../types/contract';

type Props = {
  callback?: (id: string) => void;
};

export function useUpdateContractMutation({ callback }: Props) {
  const queryClient = useQueryClient();

  return useMutation<
    Contract,
    Error,
    { contractId: string; contractData: UpdateContractDto }
  >({
    mutationKey: contractQueryKeys.all,
    mutationFn: ({ contractId, contractData }) =>
      updateContract(contractId, contractData),
    onSuccess: (contract) => {
      toast.success('Contract updated successfully');
      queryClient.invalidateQueries({ queryKey: contractQueryKeys.all });
      callback?.(contract.id);
    },
    onError: (error) => {
      console.error('Error updating contract:', error);
      toast.error('Error updating contract');
    },
  });
}

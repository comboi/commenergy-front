import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { contractQueryKeys, deleteContract } from '../api/contracts';

type Props = {
  callback?: () => void;
};

export function useDeleteContractMutation({ callback }: Props) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationKey: contractQueryKeys.all,
    mutationFn: deleteContract,
    onSuccess: () => {
      toast.success('Contract deleted successfully');
      queryClient.invalidateQueries({ queryKey: contractQueryKeys.all });
      callback?.();
    },
    onError: (error) => {
      console.error('Error deleting contract:', error);
      toast.error('Error deleting contract');
    },
  });
}

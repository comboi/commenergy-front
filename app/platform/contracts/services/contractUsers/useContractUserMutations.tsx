import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { components } from '@/lib/api-schema';

type ContractUser = components['schemas']['ContractUser'];
type CreateContractUserDto = components['schemas']['CreateContractUserDto'];
type UpdateContractUserDto = components['schemas']['UpdateContractUserDto'];

const createContractUser = async (
  contractUser: CreateContractUserDto
): Promise<ContractUser> => {
  const { data } = await apiClient.post('/contract-users', contractUser);
  return data;
};

const updateContractUser = async (
  id: string,
  contractUser: UpdateContractUserDto
): Promise<ContractUser> => {
  const { data } = await apiClient.patch(`/contract-users/${id}`, contractUser);
  return data;
};

const deleteContractUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/contract-users/${id}`);
};

type MutationProps = {
  callback?: () => void;
  contractId?: string;
};

// Create contract user hook
export function useCreateContractUser({
  callback,
  contractId,
}: MutationProps = {}) {
  const queryClient = useQueryClient();

  const { mutate, error, isError, isSuccess, ...rest } = useMutation({
    mutationFn: createContractUser,
    onSuccess: () => {
      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: ['contractUsers', contractId],
        });
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('User added to contract successfully');
      callback?.();
    } else if (isError) {
      toast.error(
        `Error adding user to contract: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }, [isSuccess, isError, error, callback]);

  return {
    createContractUser: mutate,
    error,
    ...rest,
  };
}

export function useUpdateContractUser({
  callback,
  contractId,
}: MutationProps = {}) {
  const queryClient = useQueryClient();

  const { mutate, error, isError, isSuccess, ...rest } = useMutation({
    mutationFn: ({
      id,
      contractUser,
    }: {
      id: string;
      contractUser: UpdateContractUserDto;
    }) => updateContractUser(id, contractUser),
    onSuccess: () => {
      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: ['contractUsers', contractId],
        });
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('User permissions updated successfully');
      callback?.();
    } else if (isError) {
      toast.error(
        `Error updating user permissions: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }, [isSuccess, isError, error, callback]);

  return {
    updateContractUser: mutate,
    error,
    ...rest,
  };
}

export function useDeleteContractUser({
  callback,
  contractId,
}: MutationProps = {}) {
  const queryClient = useQueryClient();

  const { mutate, error, isError, isSuccess, ...rest } = useMutation({
    mutationFn: deleteContractUser,
    onSuccess: () => {
      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: ['contractUsers', contractId],
        });
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('User removed from contract successfully');
      callback?.();
    } else if (isError) {
      toast.error(
        `Error removing user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }, [isSuccess, isError, error, callback]);

  return {
    deleteContractUser: mutate,
    error,
    ...rest,
  };
}

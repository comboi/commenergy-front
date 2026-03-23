import apiClient from '@/lib/api-client';

import {
  Contract,
  ContractUserRole,
  NewContractDto,
  UpdateContractDto,
} from '../types/contract';

export const contractQueryKeys = {
  all: ['contracts'] as const,
  list: (ownerType?: ContractUserRole | null) =>
    [...contractQueryKeys.all, 'list', ownerType ?? 'all'] as const,
  detail: (contractId: string) =>
    [...contractQueryKeys.all, 'detail', contractId] as const,
};

export async function fetchContracts(ownerType?: ContractUserRole) {
  const { data } = await apiClient.get('/contracts', {
    params: { ownerType },
  });

  return data as Contract[];
}

export async function fetchContractById(contractId: string) {
  const { data } = await apiClient.get(`/contracts/${contractId}`);
  return data as Contract;
}

export async function createContract(newContract: NewContractDto) {
  const { data } = await apiClient.post('/contracts', newContract);
  return data as Contract;
}

export async function updateContract(
  contractId: string,
  contractData: UpdateContractDto
) {
  const { data } = await apiClient.patch(`/contracts/${contractId}`, contractData);
  return data as Contract;
}

export async function deleteContract(contractId: string) {
  await apiClient.delete(`/contracts/${contractId}`);
}

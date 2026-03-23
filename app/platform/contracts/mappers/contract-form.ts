import { v4 } from 'uuid';

import { Contract, NewContractDto } from '../types/contract';
import { ContractFormValues } from '../types/contract-form';

export function createEmptyContractForm(userVat = ''): ContractFormValues {
  return {
    id: v4(),
    name: '',
    providerId: '',
    contractCode: '',
    contractType: 'CONSUMPTION',
    state: 'Active',
    contractPower: 0,
    fullAddress: '',
    userVat,
  };
}

export function mapContractToFormValues(contract: Contract): ContractFormValues {
  return {
    id: contract.id,
    name: contract.name,
    providerId: contract.provider.id,
    contractCode: contract.contractCode,
    contractType: contract.contractType,
    state: contract.state,
    contractPower: contract.contractPower ?? 0,
    fullAddress: contract.fullAddress,
    userVat: contract.userVat,
  };
}

export function mapContractFormToCreateDto(
  values: ContractFormValues
): NewContractDto {
  return {
    id: values.id,
    name: values.name,
    providerId: values.providerId,
    communityContracts: [],
    contractsCommunitiesRequests: [],
    dataSources: [],
    contractCode: values.contractCode,
    contractType: values.contractType,
    createdAt: new Date().toISOString(),
    state: values.state,
    contractPower: Number(values.contractPower) || 0,
    fullAddress: values.fullAddress,
    userVat: values.userVat,
  } as NewContractDto;
}

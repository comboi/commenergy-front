import { components } from '@/lib/api-schema';

export type Contract = components['schemas']['ContractEnriched'];
export type NewContractDto = components['schemas']['ContractDto'];
export type UpdateContractDto = Partial<NewContractDto>;
export type ContractUserRole = components['schemas']['ContractUser']['role'];

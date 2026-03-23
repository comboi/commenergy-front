import { NewContractDto } from './contract';

export type ContractFormValues = {
  id: string;
  name: string;
  providerId: string;
  contractCode: string;
  contractType: NewContractDto['contractType'];
  state: NewContractDto['state'];
  contractPower: number | string;
  fullAddress: string;
  userVat: string;
};

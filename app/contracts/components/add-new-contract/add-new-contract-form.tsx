import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { v4 } from 'uuid';

import { Contract, NewContractDto } from '../../model/contract';

import Select from '@/components/inputs/Select';
import { useUsers } from '@/app/users/services/useUsers';
import { useCreateContracts } from '../../services/useCreateContract';
import { useProviders } from '@/app/shared/providers/services/useProviders';
import { useUpdateContract } from '../../services/useUpdateContract';

type Props = {
  onClose: (contractId: string) => void;
  contractToEdit?: Contract;
};

const mapContractToNewContractDto = (contract: Contract): NewContractDto => ({
  id: contract.id,
  name: contract.name,
  providerId: contract.provider.id,
  communityContracts: contract.communityContracts,
  contractsCommunitiesRequests: contract.contractsCommunitiesRequests,
  dataSources: contract.dataSources,
  cups: contract.cups,
  contractType: contract.contractType,
  createdAt: contract.createdAt,
  state: contract.state,
  contractPower: contract.contractPower ?? 0,
  fullAddress: contract.fullAddress,
  user: contract.user.id,
  userVat: contract.userVat,
  energySourceType: contract.energySourceType,
});

const AddNewContractForm = ({ contractToEdit, onClose }: Props) => {
  const { data: users } = useUsers();
  const { data: providers } = useProviders();

  const { mutate: createContract } = useCreateContracts({ callback: onClose });
  const { mutate: updateContract } = useUpdateContract({ callback: onClose });

  const initialData = contractToEdit
    ? mapContractToNewContractDto(contractToEdit)
    : ({
        id: v4(),
        name: '',
        providerId: '',
        communityContracts: [],
        contractsCommunitiesRequests: [],
        dataSources: [],
        cups: '',
        contractType: 'CONSUMPTION',
        createdAt: new Date().toISOString(),
        state: 'Active',
        contractPower: 0,
        fullAddress: '',
        user: '',
        userVat: '',
      } as unknown as NewContractDto);

  const [formData, setFormData] = useState<NewContractDto>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contractToEdit) {
      createContract(formData);
    } else {
      updateContract({ contractId: contractToEdit.id, contractData: formData });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 flex flex-col gap-2 py-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="name">Contract Name*</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="provider">Provider*</Label>
          <Select
            onChange={(value) =>
              setFormData({
                ...formData,
                providerId: value as NewContractDto['providerId'],
              })
            }
            options={providers?.map((provider) => ({
              value: provider.id,
              label: `${provider.name}`,
            }))}
            value={formData.providerId}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="provider">Contracted Power (KW's)</Label>
          <Input
            type="number"
            name="contractPower"
            value={formData.contractPower}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="cups">CUPS*</Label>
          <Input
            type="text"
            name="cups"
            value={formData.cups}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="contractType">Contract Type*</Label>
          <Select
            onChange={(value) =>
              setFormData({
                ...formData,
                contractType: value as NewContractDto['contractType'],
              })
            }
            options={[
              { value: 'CONSUMPTION', label: 'Consumption' },
              { value: 'GENERATION', label: 'Generation' },
            ]}
            value={formData.contractType}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="fullAddress">Full Address</Label>
          <Input
            type="text"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="user">User</Label>
          <Select
            onChange={(value) =>
              setFormData({
                ...formData,
                user: value as NewContractDto['user'],
                userVat: users?.find((user) => user.id === value)?.vat ?? '',
              })
            }
            options={users?.map((user) => ({
              value: user.id,
              label: `${user.vat} - ${user.name}`,
            }))}
            value={formData.user}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="user">User Vat*</Label>
          <Input
            type="text"
            name="userVat"
            value={formData.userVat}
            onChange={handleChange}
          />
        </div>

        {!contractToEdit && <Button type="submit">Add Contract</Button>}
        {contractToEdit && (
          <div className="flex gap-4 justify-end w-full">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddNewContractForm;

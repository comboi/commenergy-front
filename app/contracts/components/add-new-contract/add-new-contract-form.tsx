import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { v4 } from 'uuid';

import { NewContractDto } from '../../model/contract';

import Select from '@/components/inputs/Select';
import { useUsers } from '@/app/users/services/useUsers';
import { useCreateContracts } from '../../services/useCreateContract';
import { useProviders } from '@/app/shared/providers/services/useProviders';
type Props = {
  onClose: () => void;
};

const AddNewContractForm = ({ onClose }: Props) => {
  const { data: users } = useUsers();
  const { data: providers } = useProviders();
  const { mutate, isSuccess, error } = useCreateContracts();

  const [formData, setFormData] = useState<NewContractDto>({
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
  });

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
    if (error) {
      console.error('Error creating contract:', error);
    }
  }, [isSuccess, error, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission

    mutate(formData);
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
          <Label htmlFor="provider">Contracted Power</Label>
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
          <Label htmlFor="user">User Vat*</Label>
          <Input
            type="text"
            name="userVat"
            value={formData.userVat}
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

        <Button type="submit">Add Contract</Button>
      </div>
    </form>
  );
};

export default AddNewContractForm;

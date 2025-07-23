import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { v4 } from 'uuid';

import { Contract, NewContractDto } from '../../model/contract';

import Select from '@/components/inputs/Select';
import VatInput from '@/components/inputs/VatInput';

import { useCreateContracts } from '../../services/useCreateContract';
import { useProviders } from '@/app/platform/shared/providers/services/useProviders';
import { useUpdateContract } from '../../services/useUpdateContract';
import { useAuth } from '@/app/platform/auth/contexts/auth-context';

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
  contractCode: contract.contractCode,
  contractType: contract.contractType,
  createdAt: contract.createdAt,
  state: contract.state,
  contractPower: contract.contractPower ?? 0,
  fullAddress: contract.fullAddress,
  userVat: contract.userVat,
  energySourceType: contract.energySourceType,
});

const AddNewContractForm = ({ contractToEdit, onClose }: Props) => {
  const { data: providers } = useProviders();
  const { user } = useAuth();

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
        contractCode: '',
        contractType: 'CONSUMPTION',
        createdAt: new Date().toISOString(),
        state: 'Active',
        contractPower: 0,
        fullAddress: '',
        userVat: user?.vat || '',
      } as unknown as NewContractDto);

  const [formData, setFormData] = useState<NewContractDto>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validar código según tipo de contrato
    if (
      formData.contractType === 'CONSUMPTION' &&
      formData.contractCode.length < 22
    ) {
      newErrors.contractCode = 'CUPS code must be at least 22 characters long';
    }

    if (
      formData.contractType === 'GENERATION' &&
      formData.contractCode.length < 26
    ) {
      newErrors.contractCode = 'CAU code must be at least 26 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!contractToEdit) {
      createContract(formData);
    } else {
      updateContract({ contractId: contractToEdit.id, contractData: formData });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 flex flex-col gap-2 py-4">
        {/* 1. Nombre */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="name">Contract Name*</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* 2. User */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="user">User Vat*</Label>
          <small className="text-muted-foreground">
            If the user VAT didn't exist this will create a new user
          </small>
          <VatInput
            value={formData.userVat}
            tooltipAlign="end"
            validateOnMount={true}
            onChange={(value) =>
              setFormData({
                ...formData,
                userVat: value,
              })
            }
            placeholder="Enter VAT number"
          />
        </div>

        {/* 3. Proveedor */}
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

        {/* 4. Tipo de contrato */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="contractType">Contract Type*</Label>
          <Select
            onChange={(value) => {
              setFormData({
                ...formData,
                contractType: value as NewContractDto['contractType'],
                contractCode: '', // Reset code when type changes
              });
              // Clear code error when type changes
              if (errors.contractCode) {
                setErrors({
                  ...errors,
                  contractCode: '',
                });
              }
            }}
            options={[
              { value: 'CONSUMPTION', label: 'Consumption' },
              { value: 'GENERATION', label: 'Generation' },
            ]}
            value={formData.contractType}
          />
        </div>

        {/* 5. Code */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="contractCode">
            Contract Code*{' '}
            {formData.contractType === 'CONSUMPTION' ? '(CUPS)' : '(CAU)'}
          </Label>
          <small className="text-muted-foreground">
            {formData.contractType === 'CONSUMPTION'
              ? 'CUPS code must be at least 22 characters long: ES0189100000020135ZM0F'
              : 'CAU code must be at least 26 characters long: ES0189100000020135ZM0FA000'}
          </small>
          <Input
            type="text"
            name="contractCode"
            value={formData.contractCode}
            onChange={handleChange}
            className={errors.contractCode ? 'border-red-500' : ''}
          />
          {errors.contractCode && (
            <span className="text-red-500 text-sm">{errors.contractCode}</span>
          )}
        </div>

        {/* 6. Status */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="state">Contract Status*</Label>
          <Select
            onChange={(value) =>
              setFormData({
                ...formData,
                state: value as NewContractDto['state'],
              })
            }
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
            value={formData.state}
          />
        </div>

        {/* 7. Address */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="fullAddress">Full Address</Label>
          <Input
            type="text"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
          />
        </div>

        {/* 8. Potencia */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="contractedPower">Power (kW)</Label>
          <Input
            type="number"
            name="contractPower"
            value={formData.contractPower}
            onChange={handleChange}
          />
        </div>

        {!contractToEdit && (
          <Button type="submit" className="w-full">
            Add Contract
          </Button>
        )}
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
